import React, { Component } from 'react';
import PersonalityQuestionnaire from '/client/ui/pages/PersonalityPage/PersonalityQuestionnaire.jsx'
import AuthTitle from '/client/ui/wrappers/auth_wrapper/AuthTitle.jsx';
import {routesParam} from '/client/router/router.js'

export default class PersonalityWrapper extends Component {

   constructor(props) {
      super(props);

      this.state = {};
   }

   render() {
    return (      
        <div className="wrapper">
           <PersonalityQuestionnaire/>
        </div>
      )
   }
}