/* eslint-disable */ // --> OFF
import { useState, useEffect } from 'react'

import { Tooltip as ReactTooltip } from 'react-tooltip'

const App = () => {
  const [place, setPlace] = useState('top')
  const [variant, setVariant] = useState('dark')
  const [effect, setEffect] = useState('float')
  const [offset, setOffset] = useState(10)
  const [wrapper, setWrapper] = useState('div')
  const [anchorId, setAnchorId] = useState('anchorBuddy1')
  const [isOpen, setIsOpen] = useState(false)

  const changePlace = (value) => {
    setPlace(value)
  }

  const changeVariant = (value) => {
    setVariant(value)
  }

  const changeEffect = (value) => {
    setEffect(value)
  }

  const changeOffset = (value) => {
    setOffset(value)
  }

  const changeWrapper = (value) => {
    setWrapper(value)
  }

  return (
    <div>
      <section className="tooltip-example">
        <h4 className="title">React Tooltip</h4>
        <div className="demonstration">
          <a
            id="exampleTooltip"
            data-content="Hello<br />multiline<br />tooltip"
            data-iscapture="true"
            data-place={place}
            data-variant={variant}
            data-offset={offset}
            data-wrapper={wrapper}
          >
            ◕‿‿◕
          </a>
        </div>
        <div className="control-panel">
          <div className="button-group">
            <div className="item">
              <p>Place</p>
              <a
                className={place === 'top' ? 'active' : ''}
                onClick={() => {
                  changePlace('top')
                }}
              >
                Top<span className="mark">(default)</span>
              </a>
              <a
                className={place === 'right' ? 'active' : ''}
                onClick={() => {
                  changePlace('right')
                }}
              >
                Right
              </a>
              <a
                className={place === 'bottom' ? 'active' : ''}
                onClick={() => {
                  changePlace('bottom')
                }}
              >
                Bottom
              </a>
              <a
                className={place === 'left' ? 'active' : ''}
                onClick={() => {
                  changePlace('left')
                }}
              >
                Left
              </a>
            </div>
            <div className="item">
              <p>Variant</p>
              <a
                className={variant === 'dark' ? 'active' : ''}
                onClick={() => {
                  changeVariant('dark')
                }}
              >
                Dark<span className="mark">(default)</span>
              </a>
              <a
                className={variant === 'success' ? 'active' : ''}
                onClick={() => {
                  changeVariant('success')
                }}
              >
                Success
              </a>
              <a
                className={variant === 'warning' ? 'active' : ''}
                onClick={() => {
                  changeVariant('warning')
                }}
              >
                Warning
              </a>
              <a
                className={variant === 'error' ? 'active' : ''}
                onClick={() => {
                  changeVariant('error')
                }}
              >
                Error
              </a>
              <a
                className={variant === 'info' ? 'active' : ''}
                onClick={() => {
                  changeVariant('info')
                }}
              >
                Info
              </a>
              <a
                className={variant === 'light' ? 'active' : ''}
                onClick={() => {
                  changeVariant('light')
                }}
              >
                Light
              </a>
            </div>
            <div className="item">
              <p>Offset (any number)</p>
              <a
                className={offset === 10 ? 'active' : ''}
                onClick={() => {
                  changeOffset(10)
                }}
              >
                10<span className="mark">(default)</span>
              </a>
              <a
                className={offset === 20 ? 'active' : ''}
                onClick={() => {
                  changeOffset(20)
                }}
              >
                20
              </a>
              <a
                className={offset === 30 ? 'active' : ''}
                onClick={() => {
                  changeOffset(30)
                }}
              >
                30
              </a>
              <a
                className={offset === 40 ? 'active' : ''}
                onClick={() => {
                  changeOffset(40)
                }}
              >
                40
              </a>
              <a
                className={offset === 50 ? 'active' : ''}
                onClick={() => {
                  changeOffset(50)
                }}
              >
                50
              </a>
            </div>
            <div className="item">
              <p>Wrapper</p>
              <a
                className={wrapper === 'div' ? 'active' : ''}
                onClick={() => {
                  changeWrapper('div')
                }}
              >
                div<span className="mark">(default)</span>
              </a>
              <a
                className={wrapper === 'span' ? 'active' : ''}
                onClick={() => {
                  changeWrapper('span')
                }}
              >
                span
              </a>
              <a
                className={wrapper === 'section' ? 'active' : ''}
                onClick={() => {
                  changeWrapper('section')
                }}
              >
                section
              </a>
            </div>
            <div className="item">
              <p>Effect</p>
              <a
                className={effect === 'float' ? 'active' : ''}
                onClick={() => {
                  changeEffect('float')
                }}
              >
                Float<span className="mark">(default)</span>
              </a>
              <a
                className={effect === 'solid' ? 'active' : ''}
                onClick={() => {
                  changeEffect('solid')
                }}
              >
                Solid
              </a>
            </div>
          </div>
          <pre>
            <div>
              <p className="label">Code - Example 1</p>
              <hr />
              <p>
                {`<a
  id="exampleTooltip"
  data-content="Hello<br />multiline<br />tooltip"
  data-place={place}
  data-variant={variant}
  data-offset={offset}
  data-wrapper={wrapper}
>
◕‿‿◕
</a>`}
              </p>
              <p>{'<ReactTooltip anchorId="exampleTooltip"/>'}</p>
            </div>
          </pre>
          <pre>
            <div>
              <p className="label">Code - Example 2</p>
              <hr />
              <p>{`<a id="exampleTooltip">◕‿‿◕</a>`}</p>
              <p>{`<ReactTooltip
  anchorId="exampleTooltip"
  content="Hello<br />multiline<br />tooltip"
  place={place}
  variant={variant}
  offset={offset}
  wrapper={wrapper}
/>`}</p>
            </div>
          </pre>
        </div>
        <ReactTooltip anchorId="exampleTooltip" />
      </section>
      <section className="advance">
        <div className="section">
          <h4 className="title">Advance features</h4>
          <p className="sub-title">Use everything as tooltip</p>

          <div className="example-jsx">
            <div className="side" style={{ transform: 'translate3d(5px, 5px, 5px)' }}>
              <a id="happyFaceError">d(`･∀･)b</a>
              <ReactTooltip anchorId="happyFaceError" variant="error">
                <span>Show happy face</span>
              </ReactTooltip>
            </div>
            <div className="side">
              <a id="sadFaceWarning">இдஇ</a>
              <ReactTooltip anchorId="sadFaceWarning" variant="warning">
                <span>Show sad face</span>
              </ReactTooltip>
            </div>
          </div>
          <br />
          <pre className="example-pre">
            <div>
              <p>
                {'<a id="happyFaceError"> d(`･∀･)b </a>\n' +
                  '<ReactTooltip anchorId="happyFaceError" variant=\'error\'>\n' +
                  ' ' +
                  ' ' +
                  '<span>Show happy face</span>\n' +
                  '</ReactTooltip>\n' +
                  '<a id="sadFaceWarning"> இдஇ </a>\n' +
                  '<ReactTooltip anchorId="sadFaceWarning" variant=\'warning\'>\n' +
                  ' ' +
                  ' ' +
                  '<span>Show sad face</span>\n' +
                  '</ReactTooltip>'}
              </p>
            </div>
          </pre>
        </div>
      </section>
      <section className="advance">
        <div className="section">
          <h4 className="title">Events</h4>
          <p className="sub-title" />
          <div className="example-jsx">
            <div className="side-3">
              <a
                id="eventHoverOnlyAnchor"
                data-content="default show and hide using hover events only"
              >
                ( •̀д•́)
              </a>
              <ReactTooltip anchorId="eventHoverOnlyAnchor" events={['hover']} />
            </div>
            <div className="side-3">
              <a
                id="eventClickOnlyAnchor"
                data-content="custom show and hide using click event only"
              >
                ( •̀д•́)
              </a>
              <ReactTooltip anchorId="eventClickOnlyAnchor" events={['click']} />
            </div>
            <div className="side-3">
              <a
                id="clickAndHoverEvent"
                data-content="custom show and hide using click and hover event"
                data-events="click hover"
              >
                ( •̀д•́)
              </a>
              <ReactTooltip anchorId="clickAndHoverEvent" />
            </div>
          </div>
          <br />
          <pre className="example-pre">
            <div>
              <p>
                {'<a \n id="eventHoverOnlyAnchor" \n data-content="default show and hide using hover events only"\n>( •̀д•́)</a>\n' +
                  '<ReactTooltip anchorId="eventHoverOnlyAnchor" events={[\'hover\']} />'}
              </p>
            </div>
            <div>
              <p>
                {'<a \n id="eventClickOnlyAnchor" \n data-content="custom show and hide using click event only"\n>( •̀д•́)</a>\n' +
                  '<ReactTooltip anchorId="eventClickOnlyAnchor" events={[\'click\']} />'}
              </p>
            </div>
            <div>
              ------------------------------------------------ <br /> Option 1 for events
              <p>
                {'<a \n id="clickAndHoverEvent" \n data-content="custom show and hide using click and hover event" \n data-events="click hover"\n>( •̀д•́)</a>\n' +
                  '<ReactTooltip anchorId="clickAndHoverEvent" />'}
              </p>
            </div>
            <div>
              ------------------------------------------------ <br /> Option 2 for events
              <p>
                {'<a \n id="clickAndHoverEvent" \n data-content="custom show and hide using click and hover event"\n>( •̀д•́)</a>\n' +
                  "<ReactTooltip anchorId=\"clickAndHoverEvent\" events={['click', 'hover']} />"}
              </p>
            </div>
          </pre>
        </div>

        <div className="section">
          <h4 className="title">Custom event</h4>
          <p className="sub-title" />
          <div className="example-jsx">
            <div className="side-3">
              <a
                id="customEventHoverOnlyAnchor"
                data-content="default show and hide using hover events only"
              >
                ( •̀д•́)
              </a>
              <ReactTooltip anchorId="customEventHoverOnlyAnchor" events={['hover']} />
            </div>
            <div className="side-3">
              <a
                id="customEventClickOnlyAnchor"
                data-content="custom show and hide using click event only"
              >
                ( •̀д•́)
              </a>
              <ReactTooltip anchorId="customEventClickOnlyAnchor" events={['click']} />
            </div>
            <div className="side-3">
              <a
                id="customClickAndHoverEvent"
                data-content="custom show and hide using click and hover event"
                data-events="click hover"
              >
                ( •̀д•́)
              </a>
              <ReactTooltip anchorId="customClickAndHoverEvent" />
            </div>
          </div>
          <br />
          <pre className="example-pre">
            <div>
              <p>
                {'<a \n id="customEventHoverOnlyAnchor" \n data-content="default show and hide using hover events only"\n>( •̀д•́)</a>\n' +
                  '<ReactTooltip anchorId="customEventHoverOnlyAnchor" events={[\'hover\']} />'}
              </p>
            </div>
            <div>
              <p>
                {'<a \n id="customEventClickOnlyAnchor" \n data-content="custom show and hide using click event only"\n>( •̀д•́)</a>\n' +
                  '<ReactTooltip anchorId="customEventClickOnlyAnchor" events={[\'click\']} />'}
              </p>
            </div>
            <div>
              ------------------------------------------------ <br /> Option 1 for events
              <p>
                {'<a \n id="customClickAndHoverEvent" \n data-content="custom show and hide using click and hover event" \n data-events="click hover"\n>( •̀д•́)</a>\n' +
                  '<ReactTooltip anchorId="customClickAndHoverEvent" />'}
              </p>
            </div>
            <div>
              ------------------------------------------------ <br /> Option 2 for events
              <p>
                {'<a \n id="customClickAndHoverEvent" \n data-content="custom show and hide using click and hover event"\n>( •̀д•́)</a>\n' +
                  "<ReactTooltip anchorId=\"customClickAndHoverEvent\" events={['click', 'hover']} />"}
              </p>
            </div>
          </pre>
        </div>

        <div className="section">
          <h4 className="title">Custom colors</h4>
          <p className="sub-title" />
          <div className="example-jsx">
            <div className="side">
              <a data-for="custom-color-no-arrow" data-content="Lovely colors!">
                ㅇㅅㅇ
              </a>
              <ReactTooltip
                id="custom-color-no-arrow"
                className="custom-color-no-arrow"
                textColor="#5F4B8BFF"
                backgroundColor="#E69A8DFF"
                effect="solid"
              />
            </div>
            <div className="side">
              <a
                data-for="custom-color"
                data-content="That is one weird arrow (and a border with custom class name)!"
              >
                V(^-^)V
              </a>
              <ReactTooltip
                id="custom-color"
                className="custom-color"
                place="right"
                border
                borderClass="custom-border-class"
                textColor="#5F4B8BFF"
                backgroundColor="#E69A8DFF"
                borderColor="darkgreen"
                arrowColor="red"
              />
            </div>
          </div>
          <br />
          <pre className="example-pre">
            <div>
              <p>
                {"<a data-for='custom-color-no-arrow' data-content='Lovely colors!'>ㅇㅅㅇ</a>\n" +
                  "<ReactTooltip id='custom-color-no-arrow' className='custom-color-no-arrow' delayHide={1000}\n" +
                  "textColor='#5F4B8BFF' backgroundColor='#E69A8DFF' effect='solid'/>"}
              </p>
            </div>
            <div>
              <p>
                {"<a data-for='custom-color' data-content='That is one weird arrow (and a border)!'>V(^-^)V</a>\n" +
                  "<ReactTooltip id='custom-color' className='custom-color' place='right' border\n" +
                  "textColor='#5F4B8BFF' backgroundColor='#E69A8DFF' borderColor='darkgreen' arrowColor='red'/>"}
              </p>
            </div>
          </pre>
        </div>

        <div className="section">
          <h4 className="title">Delays</h4>
          <p className="sub-title" />
          <div className="example-jsx">
            <div className="side">
              <a
                id="delayShowAnchor"
                data-content="delayed 3 seconds tooltip content"
                data-delay-show={3000}
              >
                (･ω´･ )
              </a>
              <ReactTooltip anchorId="delayShowAnchor" />
            </div>
            <div className="side">
              <a
                id="delayHideAnchor"
                data-content="hover on me will keep the tooltip"
                data-delay-hide={3000}
              >
                (･ω´･ )
              </a>
              <ReactTooltip anchorId="delayHideAnchor" />
            </div>
          </div>
          <br />
          <pre className="example-pre">
            <div>
              <p>
                {`<a
  id="delayShowAnchor"
  data-content="delayed 3 seconds tooltip content"
  data-delay-show={3000}
>
  (･ω´･ )
</a>
<ReactTooltip anchorId="delayShowAnchor" />`}
              </p>
            </div>
            <div>
              <p>
                {`<a
  id="delayHideAnchor"
  data-content="hover on me will keep the tooltip"
  data-delay-hide={3000}
>
  (･ω´･ )
</a>
<ReactTooltip anchorId="delayHideAnchor" />`}
              </p>
            </div>
          </pre>
        </div>

        <div className="section">
          <h4 className="title">Custom Classes</h4>
          <p className="sub-title" />
          <div className="example-jsx">
            <div className="side">
              <a
                id="customClassAnchor"
                data-content="This tooltip has custom class for tooltip and for arrow"
              >
                (･ω´･ )
              </a>
              <ReactTooltip
                anchorId="customClassAnchor"
                className="extraClass"
                classNameArrow="extraClassArrow"
              />
            </div>
          </div>
          <br />
          <pre className="example-pre">
            <div>
              <p>
                {"<a data-content='This tooltip has custom class for tooltip and for arrow'>(･ω´･ )</a>\n" +
                  "<ReactTooltip\n className='extraClass'\n classNameArrow='extraClassArrow'\n delayHide={1000}\n effect='solid'/>\n\n" +
                  '.extraClass {\n' +
                  ' font-size: 20px;\n' +
                  ' background-color: #00ffe5;\n' +
                  ' color: #222;\n' +
                  '}\n' +
                  '.extraClass .extraClassArrow {\n' +
                  ' background-color: #00ffe5;\n' +
                  '}\n\n'}
                You don't need to use <b>!important</b>. You can just use CSS Specificity knowledge.{' '}
                <br />
                https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity <br />
                https://www.w3schools.com/css/css_specificity.asp
              </p>
            </div>
          </pre>
        </div>

        <div className="section">
          <h4 className="title">Compute or enrich tip content</h4>
          <p className="sub-title" />
          <div className="example-jsx">
            <div className="side">
              <a id="enrichAnchor" data-content="sooooo cute">
                (❂‿❂)
              </a>
            </div>
            <div className="side">
              <a id="enrichAnchor2" data-content="really high">
                (❂‿❂)
              </a>
            </div>
            <ReactTooltip
              anchorId="enrichAnchor"
              getContent={(dataTip) => `This little buddy is ${dataTip}`}
            />
            <ReactTooltip
              anchorId="enrichAnchor2"
              getContent={(dataTip) => `This little buddy is ${dataTip}`}
            />
          </div>
          <br />
          <pre className="example-pre">
            <div>
              <p>
                {"<a data-for='enrich' data-content='sooooo cute'>(❂‿❂)</a>\n" +
                  "<a data-for='enrich' data-content='really high'>(❂‿❂)</a>\n" +
                  "<ReactTooltip id='enrich' getContent={(dataTip) => `This little buddy is ${dataTip}`}/>"}
              </p>
            </div>
          </pre>
        </div>

        <div className="section">
          <h4 className="title">Test Scrolling</h4>
          <p className="sub-title" />
          <div className="example-jsx" style={{ height: '200px' }}>
            <div className="side" style={{ overflow: 'auto', height: '200px' }}>
              <div
                data-for="scrollContent"
                data-content
                data-iscapture="true"
                style={{ width: '5000px', height: '5000px' }}
              >
                Scroll me with the mouse wheel.
                <br />
                The tooltip will hide.
                <br />
                Make sure you set data-iscapture="true"
              </div>
              <ReactTooltip id="scrollContent" getContent={() => Math.floor(Math.random() * 100)} />
            </div>
            <div className="side" style={{ overflow: 'auto', height: '200px' }}>
              <div
                data-for="scrollTime"
                data-content
                data-iscapture="true"
                data-scroll-hide="false"
                style={{ width: '5000px', height: '5000px' }}
              >
                Scroll me with the mouse wheel.
                <br />
                The tooltip will stay visible.
              </div>
              <ReactTooltip
                id="scrollTime"
                // getContent={[
                //   () => {
                //     return new Date().toISOString()
                //   },
                //   1000,
                // ]}
              />
            </div>
          </div>
          <br />
          <pre className="example-pre">
            <div>
              <p>
                {"<div data-for='scrollContent' data-content data-iscapture='true'\n" +
                  "style={{ width: '5000px', height: '5000px' }}>...</div>\n" +
                  "<ReactTooltip id='scrollContent' getContent={() => Math.floor(Math.random() * 100)}/>"}
              </p>
            </div>
            <div>
              <p>
                {"<div data-for='scrollTime' data-content data-iscapture='true' data-scroll-hide='false'\n" +
                  "style={{ width: '5000px', height: '5000px' }}>...</div>\n" +
                  "<ReactTooltip id='scrollTime' getContent={[() => {return new Date().toISOString()}, 1000]}/>"}
              </p>
            </div>
          </pre>
        </div>

        <div className="section">
          <h4 className="title">Test SVG</h4>
          <p className="sub-title" />
          <div className="example-jsx">
            <div className="side" style={{ textAlign: 'center' }}>
              <svg data-content="=( •̀д•́)" id="svgTooltipAnchor" width="50" height="50">
                <circle cx="25" cy="25" r="22" fill="#fff" stroke="#000" strokeWidth="4" />
              </svg>
              <ReactTooltip anchorId="svgTooltipAnchor" />
            </div>
            <div className="side" style={{ textAlign: 'center' }}>
              <svg width="75" height="50">
                <circle
                  data-content="=( •̀‿•́)"
                  id="svgTooltip2Anchor"
                  cx="25"
                  cy="25"
                  r="22"
                  fill="#fff"
                  stroke="#000"
                  strokeWidth="4"
                />
                <circle
                  data-content="=( ❂‿❂)"
                  id="svgTooltip3Anchor"
                  cx="50"
                  cy="25"
                  r="16"
                  fill="#ddd"
                  stroke="#444"
                  strokeWidth="4"
                />
              </svg>
              <ReactTooltip anchorId="svgTooltip2Anchor" />
              <ReactTooltip anchorId="svgTooltip3Anchor" />
            </div>
          </div>
          <br />
          <pre className="example-pre">
            <div>
              <p>
                {"<svg data-content='=( •̀д•́)' id=\"svgTooltipAnchor\" width='50' height='50'>\n" +
                  "  <circle cx='25' cy='25' r='22' fill='#fff' stroke='#000' strokeWidth='8'/>\n" +
                  '</svg>\n' +
                  '<ReactTooltip anchorId="svgTooltipAnchor" />'}
              </p>
              <p>
                {"<svg width='75' height='50'>\n" +
                  '<circle \n data-content=\'=( •̀‿•́)\' \n id="svgTooltip2Anchor"\n' +
                  " cx='25' cy='25' r='22' fill='#fff' stroke='#000' strokeWidth='4'/>\n" +
                  '<circle \n data-content=\'=( ❂‿❂)\' \n id="svgTooltip3Anchor"\n' +
                  " cx='50' cy='25' r='16' fill='#fdf' stroke='#404' strokeWidth='4'/>\n" +
                  '</svg>\n' +
                  '<ReactTooltip anchorId="svgTooltip2Anchor" /> \n<ReactTooltip anchorId="svgTooltip3Anchor" />'}
              </p>
            </div>
          </pre>
        </div>

        <div className="section">
          <h4 className="title">Demonstrate using mouse in tooltip. </h4>
          <p>
            Notice that the tooltip delays going away so you can get your mouse in it. You must set
            delayUpdate and delayHide for the tooltip to stay long enough to get your mouse over it.
          </p>
          <p className="sub-title" />
          <div className="example-jsx">
            <div className="block">
              <a
                id="anchorBuddy1"
                onMouseEnter={() => {
                  setAnchorId('anchorBuddy1')
                  setIsOpen(true)
                }}
                data-content="1"
              >
                1 (❂‿❂)
              </a>
            </div>
            <div className="block">
              <a
                id="anchorBuddy2"
                onMouseEnter={() => {
                  setAnchorId('anchorBuddy2')
                  setIsOpen(true)
                }}
                data-content="2"
              >
                2 (❂‿❂)
              </a>
            </div>
            <div className="block">
              <a
                id="anchorBuddy3"
                onMouseEnter={() => {
                  setAnchorId('anchorBuddy3')
                  setIsOpen(true)
                }}
                data-content="3"
              >
                3 (❂‿❂)
              </a>
            </div>
            <div className="block">
              <a
                id="anchorBuddy4"
                onMouseEnter={() => {
                  setAnchorId('anchorBuddy4')
                  setIsOpen(true)
                }}
                data-content="4"
              >
                4 (❂‿❂)
              </a>
            </div>
            <div className="block">
              <a
                id="anchorBuddy5"
                onMouseEnter={() => {
                  setAnchorId('anchorBuddy5')
                  setIsOpen(true)
                }}
                data-content="5"
              >
                5 (❂‿❂)
              </a>
            </div>
            <div className="block">
              <a
                id="anchorBuddy6"
                onMouseEnter={() => {
                  setAnchorId('anchorBuddy6')
                  setIsOpen(true)
                }}
                data-content="6"
              >
                6 (❂‿❂)
              </a>
            </div>
            <div className="block">
              <a
                id="anchorBuddy7"
                onMouseEnter={() => {
                  setAnchorId('anchorBuddy7')
                  setIsOpen(true)
                }}
                data-content="7"
              >
                7 (❂‿❂)
              </a>
            </div>
            <div className="block">
              <a
                id="anchorBuddy8"
                onMouseEnter={() => {
                  setAnchorId('anchorBuddy8')
                  setIsOpen(true)
                }}
                data-content="8"
              >
                8 (❂‿❂)
              </a>
            </div>

            <ReactTooltip
              anchorId={anchorId}
              getContent={(dataTip) => `This little buddy is ${dataTip}`}
              place="top"
              isOpen={isOpen}
            />
          </div>
          <br />
          <pre className="example-pre">
            <div>
              <p>{"<a data-for='soclose' data-content='1'>1 (❂‿❂)</a>"}</p>
              <p>{"<a data-for='soclose' data-content='2'>2 (❂‿❂)</a>..."}</p>
              <p>{"<a data-for='soclose' data-content='8'>8 (❂‿❂)</a>"}</p>
              <p>
                {"<ReactTooltip id='soclose'\n" +
                  '  getContent={(dataTip) => \n' +
                  '  <div><h3>This little buddy is {dataTip}</h3><p>Put mouse here</p></div> }\n' +
                  "  effect='solid'\n" +
                  '  delayHide={500}\n' +
                  '  delayShow={500}\n' +
                  '  delayUpdate={500}\n' +
                  "  place={'right'}\n" +
                  '  border={true}\n' +
                  "  variant={'light'}\n" +
                  '/>'}
              </p>
            </div>
          </pre>

          <p>
            When <em>clickable</em> property is set to <em>true</em>, tooltip can respond to mouse
            (or touch) events.
          </p>
          <p className="sub-title" />
          <div className="example-jsx">
            <div className="block">
              <a data-content data-for="clickme" data-event="click">
                (❂‿❂)
              </a>
            </div>

            <ReactTooltip id="clickme" place="right" effect="solid" clickable>
              <input type="text" placeholder="Type something..." />
            </ReactTooltip>
          </div>
          <br />
          <pre className="example-pre">
            <div>
              <p>{"<a data-content data-for='clickme' data-event='click'> (❂‿❂) </a>"}</p>
              <p>
                {"<ReactTooltip id='clickme' place='right' effect='solid' clickable={true}>\n" +
                  "<input type='text' placeholder='Type something...' /> \n" +
                  '</ReactTooltip>'}
              </p>
            </div>
          </pre>
        </div>
      </section>
    </div>
  )
}

export default App
