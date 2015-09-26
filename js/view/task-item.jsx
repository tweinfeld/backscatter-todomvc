import _ from 'underscore';
import React from 'react';

const KEY_ENTER = 13,
	  KEY_ESCAPE = 27;

export default class TaskItem extends React.Component {

	constructor(props){
		super(props);

		this.state = {
			"editing": false,
			"description": props.description
		}
	}

	componentWillReceiveProps(props){
		this.setState({ "description": props.description });
	}

	render(){
		return <li className={ [
						this.props.completed && "completed",
						this.state.editing && "editing"
					].filter(Boolean).join(' ') }
			>
			<div className="view">
				<input
					className="toggle"
					type="checkbox"
					checked={ this.props.completed }
					onChange={ this.props.onToggleCompleted }
				/>
				<label onDoubleClick={ this.beginEditing.bind(this) }>{ this.props.description }</label>
				<button onClick={ this.props.onRemove } className="destroy"></button>
			</div>
			<input className="edit"
				   ref="editField"
				   value={ this.state.description }
				   onChange={ _.compose(this.setState.bind(this), (e) => ({ description: e.target.value })) }
				   onKeyDown={ this.handleKeyDown.bind(this) }
				   onBlur={ this.endEditing.bind(this) }
			/>
		</li>
	}

	beginEditing(){
		this.setState({ "description": this.props.description, "editing": true }, function(){
			let node = React.findDOMNode(this.refs.editField);
			node.focus();
			node.setSelectionRange(node.value.length, node.value.length);
		});
	}

	endEditing(){
		this.setState({ "editing": false });
	}

	handleKeyDown(event){
		({
			[KEY_ESCAPE]: this.endEditing,
			[KEY_ENTER]: _.compose(_.partial(this.props.onRename, event.target.value), this.endEditing)
		}[event.which] || _.noop).call(this);
	}
}

TaskItem.defaultProps = {
	"id": 0,
	"description": "",
	"completed": false,
	"onRename": _.noop,
	"onToggleCompleted": _.noop,
	"onRemove": _.noop
};
