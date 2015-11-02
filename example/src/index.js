'use strict'

import React from 'react'
import {render} from 'react-dom'
import ReactTooltip from '../../src/index'

const Test = React.createClass({

  getInitialState () {
    return {
      place: 'top',
      type: 'dark',
      effect: 'float',
      condition: false
    }
  },

  changePlace (place) {
    this.setState({
      place: place
    })
  },

  changeType (type) {
    this.setState({
      type: type
    })
  },

  changeEffect (effect) {
    this.setState({
      effect: effect
    })
  },

  _onClick () {
    this.setState({
      condition: true
    })
  },

  render () {
    let { place, type, effect } = this.state
    return (
      <div>
        <section className='tooltip-example'>
          <h4 className='title'>React Tooltip</h4>
          <div className='demonstration'>
            <a data-tip="Hello<br />multiline<br />tooltip">
               ◕‿‿◕
            </a>
          </div>
          <div className='control-panel'>
            <div className='button-group'>
              <div className='item'>
                <p>Place</p>
                <a className={place === 'top' ? 'active' : ''} onClick={this.changePlace.bind(this, 'top')}>Top<span className='mark'>(default)</span></a>
                <a className={place === 'right' ? 'active' : ''} onClick={this.changePlace.bind(this, 'right')}>Right</a>
                <a className={place === 'bottom' ? 'active' : ''} onClick={this.changePlace.bind(this, 'bottom')}>Bottom</a>
                <a className={place === 'left' ? 'active' : ''} onClick={this.changePlace.bind(this, 'left')}>Left</a>
              </div>
              <div className='item'>
                <p>Type</p>
                <a className={type === 'dark' ? 'active' : ''} onClick={this.changeType.bind(this, 'dark')}>Dark<span className='mark'>(default)</span></a>
                <a className={type === 'success' ? 'active' : ''} onClick={this.changeType.bind(this, 'success')}>Success</a>
                <a className={type === 'warning' ? 'active' : ''} onClick={this.changeType.bind(this, 'warning')}>Warning</a>
                <a className={type === 'error' ? 'active' : ''} onClick={this.changeType.bind(this, 'error')}>Error</a>
                <a className={type === 'info' ? 'active' : ''} onClick={this.changeType.bind(this, 'info')}>Info</a>
                <a className={type === 'dlight' ? 'active' : ''} onClick={this.changeType.bind(this, 'light')}>Light</a>
              </div>
              <div className='item'>
                <p>Effect</p>
                <a className={effect === 'float' ? 'active' : ''} onClick={this.changeEffect.bind(this, 'float')}>Float<span className='mark'>(default)</span></a>
                <a className={effect === 'solid' ? 'active' : ''} onClick={this.changeEffect.bind(this, 'solid')}>Solid</a>
              </div>
            </div>
            <pre>
              <div>
                <p className='label'>Code</p>
                <hr></hr>
                <p>{'<a data-tip="React-tooltip"> ◕‿‿◕ </a>'}</p>
                <p>{'<ReactTooltip place="' + place + '" type="' + type + '" effect="' + effect + '"/>'}</p>
              </div>
            </pre>
          </div>
          <ReactTooltip place={place} type={type} effect={effect} multiline={true} />
        </section>
        <section className="advance">
          <div className="section">
            <h4 className='title'>Advance features</h4>
            <p className="sub-title">Use everything as tooltip</p>
          
            <div className="example-jsx">
              <div className="side">
                <a data-tip data-for='happyFace'> d(`･∀･)b </a>
                <ReactTooltip id='happyFace' type="error"><span>Show happy face</span></ReactTooltip>
              </div>
              <div className="side">
                <a data-tip data-for='sadFace'> இдஇ </a>
                <ReactTooltip id='sadFace' type="warning" effect="solid"><span>Show sad face</span></ReactTooltip>
              </div>
            </div>
            <br />
            <pre className='example-pre'>
              <div>
                <p>{"<a data-tip data-for='happyFace'> d(`･∀･)b </a>\n" +
                "<ReactTooltip id='happyFace' type='error'>\n" +
                  " " + " " + "<span>Show happy face</span>\n" +
                "</ReactTooltip>\n" +
                "<a data-tip data-for='sadFace'> இдஇ </a>\n" +
                "<ReactTooltip id='sadFace' type='warning' effect='solid'>\n" +
                  " " + " " + "<span>Show sad face</span>\n" +
                "</ReactTooltip>"}</p>
              </div>
            </pre>
          
            <div className="example-jsx">
              <div className="side"><a data-tip data-for='global'> σ`∀´)σ </a></div>
              <div className="side"><a data-tip data-for='global'> (〃∀〃) </a></div>
              <ReactTooltip id='global'>
                <p>This is a globle react component tooltip</p>
                <p>You can put every thing here</p>
                <ul>
                  <li>Word</li>
                  <li>Chart</li>
                  <li>Else</li>
                </ul>
              </ReactTooltip>
            </div>
            <pre className='example-pre'>
              <div>
                <p>{"<a data-tip data-for='global'> σ`∀´)σ </a>\n" +
                  "<a data-tip data-for='global'> (〃∀〃) </a>\n" +
                  "<ReactTooltip id='global'>\n" +
                    " <p>This is a globle react component tooltip</p>\n" +
                    " <p>You can put every thing here</p>\n" +
                    " <ul>\n" +
                      " " + " " + " <li>Word</li>\n" +
                      " " + " " + " <li>Chart</li>\n" +
                      " " + " " + " <li>Else</li>\n" +
                    " </ul>\n" +
                  "</ReactTooltip>"}</p>
              </div>
            </pre>
          </div>
        </section>
      </div>
    )
  }
})

render(<Test />, document.getElementById('main'))