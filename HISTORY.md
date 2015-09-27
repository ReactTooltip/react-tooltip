v0.6.4
======
release date: 2015-09-27
###Notable Changes:

Multiline option now only detect <br>, <br/> and <br /> to seperate tooltip 


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
