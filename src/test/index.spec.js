import renderer from 'react-test-renderer'
import debounce from 'utils/debounce'
import { computeTooltipPosition } from 'utils/compute-positions'
import { TooltipController as Tooltip } from '../components/TooltipController'

// Tell Jest to mock all timeout functions
jest.useRealTimers()

// eslint-disable-next-line react/prop-types
const TooltipProps = ({ id, ...tooltipParams }) => (
  <>
    <span id={id}>Lorem Ipsum</span>
    <Tooltip anchorId={id} {...tooltipParams} />
  </>
)
// eslint-disable-next-line react/prop-types
const TooltipAttrs = ({ id, ...anchorParams }) => (
  <>
    <span id={id} {...anchorParams}>
      Lorem Ipsum
    </span>
    <Tooltip anchorId={id} />
  </>
)

describe('tooltip props', () => {
  test('tooltip component - without anchorId', () => {
    const component = renderer.create(<TooltipProps content="Hello World!" />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('tooltip component - without element reference', () => {
    const component = renderer.create(<Tooltip />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('basic tooltip component', () => {
    const component = renderer.create(<TooltipProps id="basic-example" content="Hello World!" />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('tooltip component - html', () => {
    const component = renderer.create(
      <TooltipProps id="basic-example-html" html="Hello World!" variant="info" place="top" />,
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('tooltip component - getContent', () => {
    const component = renderer.create(
      <TooltipProps
        id="basic-example-get-content"
        content="Hello World!"
        getContent={(value) => `${value} Manipuled!`}
        variant="info"
        place="top"
      />,
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('tooltip component - delayShow', () => {
    const component = renderer.create(
      <TooltipProps id="basic-example-delay-show" content="Hello World!" delayShow={1000} />,
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('tooltip component - delayHide', () => {
    const component = renderer.create(
      <TooltipProps id="basic-example-delay-hide" content="Hello World!" delayHide={1000} />,
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('tooltip component - position props', () => {
    const component = renderer.create(
      <TooltipProps id="position-props" content="Hello World!" position={{ x: 0, y: 0 }} />,
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

describe('tooltip attributes', () => {
  test('tooltip component - without anchorId', () => {
    const component = renderer.create(<TooltipAttrs data-tooltip-content="Hello World!" />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('basic tooltip component', () => {
    const component = renderer.create(
      <TooltipAttrs id="basic-example-attr" data-tooltip-content="Hello World!" />,
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('tooltip component - html', () => {
    const component = renderer.create(
      <TooltipAttrs
        id="basic-example-html-attr"
        data-tooltip-html="Hello World!"
        data-tooltip-variant="info"
        data-tooltip-place="top"
      />,
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('tooltip component - delayShow', () => {
    const component = renderer.create(
      <TooltipAttrs
        id="basic-example-delay-show-attr"
        data-tooltip-content="Hello World!"
        data-tooltip-delay-show={1000}
      />,
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('tooltip component - delayHide', () => {
    const component = renderer.create(
      <TooltipAttrs
        id="basic-example-delay-hide-attr"
        data-tooltip-content="Hello World!"
        data-tooltip-delay-hide={1000}
      />,
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

describe('compute positions', () => {
  test('empty reference elements', async () => {
    const value = await computeTooltipPosition({
      elementReference: null,
      tooltipReference: null,
      tooltipArrowReference: null,
    })

    expect(value).toEqual({ tooltipStyles: {}, tooltipArrowStyles: {} })
  })

  test('empty tooltip reference element', async () => {
    const element = document.createElement('div')
    const value = await computeTooltipPosition({
      elementReference: element,
      tooltipReference: null,
      tooltipArrowReference: null,
    })

    expect(value).toEqual({ tooltipStyles: {}, tooltipArrowStyles: {} })
  })

  test('empty tooltip arrow reference element', async () => {
    const element = document.createElement('div')
    const elementTooltip = document.createElement('div')
    const value = await computeTooltipPosition({
      elementReference: element,
      tooltipReference: elementTooltip,
      tooltipArrowReference: null,
    })

    expect(value).toEqual({
      tooltipArrowStyles: {},
      tooltipStyles: {
        left: '5px',
        top: '10px',
      },
    })
  })

  test('all reference elements', async () => {
    const element = document.createElement('div')
    const elementTooltip = document.createElement('div')
    const elementTooltipArrow = document.createElement('div')
    const value = await computeTooltipPosition({
      elementReference: element,
      tooltipReference: elementTooltip,
      tooltipArrowReference: elementTooltipArrow,
    })

    expect(value).toEqual({
      tooltipArrowStyles: {
        bottom: '-4px',
        left: '5px',
        right: '',
        top: '',
      },
      tooltipStyles: {
        left: '5px',
        top: '-10px',
      },
    })
  })
})

describe('debounce', () => {
  jest.useFakeTimers()

  let func
  let debouncedFunc

  beforeEach((timeout = 1000) => {
    func = jest.fn()
    debouncedFunc = debounce(func, timeout)
  })

  test('execute just once', () => {
    for (let i = 0; i < 100; i += 1) {
      debouncedFunc()
    }

    // Fast-forward time
    jest.runAllTimers()

    expect(func).toBeCalledTimes(1)
  })
})
