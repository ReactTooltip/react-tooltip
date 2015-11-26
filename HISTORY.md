v0.9.0
======
release date: 2015-11-26
###Notable Changes:

#### customer event
`<ReactTooltip event='click'>` or `<a data-event='click'></a>`


v0.8.0
======
release date: 2015-10-16
###Notable Changes:

#### delay hide the tooltip
`<ReactTooltip delayHide=1000>` or `<a data0delay-hide="1000"></a>`

#### Change data-position to data-offset


v0.7.0
======
release date: 2015-10-12
###Notable Changes:

#### Customer extra class
Now support `<ReactTooltip class="myClass"/>` to append your own custom class, use `!important` if your class doesn't make effect

#### Insert HTML as tooltip
`<ReactTooltip html={true}>` then you can set html as your tooltip `<a data-tip='<p>html tooltip</p>'></a>`

#### Use React component as your tooltip

```
<p data-tip data-for="myTooltip"></p>
<ReactTooltip id="myTooltip">
 <div>Tooltip</div>
 <p>sub tooltip</p>
</ReactTooltip>
```

You can find how to use this in [React-tooltip Test](http://wwayne.github.io/react-tooltip)

**Note: ** 

1. **data-tip** is necessary, because `<ReactTooltip />` find tooltip via this attribute
2. **data-for** corresponds to the **id** of `<ReactTooltip />`
3. When using react component as tooltip, you can have many `<ReactTooltip />` in a page but they should have different **id**



v0.6.4
======
release date: 2015-09-27
###Notable Changes:

Multiline option now only detect `<br>`, `<br/>` and `<br />` to seperate tooltip 


v0.6.2
======
release date: 2015-09-16
###Notable Changes:

now you can use ReactTooltip class method to hide or rebuild

* ReactTooltip.hide()
* ReactTooltip.rebuild()

```
import ReactTooltip from 'react-tooltip'

class MyComponent extends React.Component {

 constructor ()  {
   super()
   this.state = {
     showButton: true
   }
 }

 onClick() {
   this.setState({
     showButton: false
   })
   ReactTooltip.hide()        // this will hide current tooltip
 }

 render() {
   <div>
    {this.state.showButton &&
      <a data-tip="tooltip" onClick={::this.onClick}>Button</a>
    }
    <ReactTooltip />
   </div>

 }

}
```


v0.5.0
======
Release date: 2015-09-12

###Notable Changes:
#### Usage:
* You don't have to import sass or css file, the style has been insert into the react-tooltip component 
* You need to set the mulitiline attribute to `true` if you want to show mulitiline tooltip `<ReactTooltip multiline={true} />`

#### Structure:
Since I find more and more peolple are interesting in contributing to the project, it would be better to have a standard rule and coding convention. So the structure of the project has been dramatically updated.

And the follows have been imported:

* [Standard](https://github.com/feross/standard)
* Circle 

#### Developer:
`npm run dev`  for developing(you can modify example to check your code)

`npm run test` to check code style and run test (you have to make this pass if you want to make pull request)

`npm run deploy` you need to execute this before you make pull request
