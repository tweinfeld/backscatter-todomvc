import _ from 'underscore';
import React from 'react';
import Main from './view/main';
import SessionModel from './model/session'

export default (window) => {

	let session = new SessionModel;
	session.get('tasks').set(JSON.parse(window.localStorage["todo-backscatter"] || "[]"));

	let render = ()=>{
		React.render(React.createElement(Main, {
			tasks: session.get('tasks').toJSON(),
			filter: session.get('filter'),
			onAllTasksToggleCompleted: () => session.get('tasks').toggleCompleted(),
			onTaskToggleCompleted: (taskId) => session.get('tasks').get(taskId).toggleCompleted(),
			onTaskRename: (taskId, newDescription) => session.get('tasks').get(taskId).set({ description: newDescription }, { validate: true }),
			onFilterChange: (filter) => session.set({ filter }),
			onTaskRemove: (taskId) => session.get('tasks').remove(session.get('tasks').get(taskId)),
			onTaskAdd: (description) => { session.get('tasks').add({ id: _.uniqueId('task-'), description }, { validate: true }) },
			onAllCompletedTasksRemove: ()=> session.get('tasks').removeCompleted()
		}), document.getElementsByTagName('main')[0]);
	};

	let persist = _.debounce(()=> window.localStorage["todo-backscatter"] = JSON.stringify(session.get('tasks').toJSON()), 500);

	// The following line is the one and only usage of backscatter across this entire application
	// It will make sure "render" is triggered everytime something changes anywhere below "session"
	session.backscatterOn(_.compose(persist, _.debounce(render)))();
}
