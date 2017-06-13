import React, { Component } from 'react'

import DateOfBirth from './form_components/DateOfBirth.jsx';
import Gender from './form_components/Gender.jsx';
import Nationality from './form_components/Nationality.jsx'
import Questions from './form_components/Questions.jsx';
import Privacy from './form_components/Privacy.jsx'
import LoadingWrapper from '/client/ui/components/loading/LoadingWrapper.jsx'
import { routesPath, routesParam } from '/client/router/router';
import SelectTest from './form_components/DropDownMenu.jsx';
import { createContainer } from 'meteor/react-meteor-data';
import LoadingItem from '/client/ui/components/loading/LoadingItem.jsx'




export default class DemographicPage extends React.Component {
    constructor( props ) {
        super( props );

        this.state = {
            is_processing: false,
            error_message: null,
            questionnaire_done: false,
			data_load: null
        };
    }
	componentDidMount() {
	this.setState({
		date_load: (new Date).getTime()
	});}

    onFormQuestionnaireSubmit( event ) {
        event.preventDefault();
        this.setState( { is_processing: true, error_message: null } );
        this.checkErrors(( res ) => {
            this.setState( { is_processing: false, error_message: null } );
            this.setState( { is_processing: false, error_message: null } );
            if ( res.dateOfBirth && res.gender && res.nationality && res.privacy) {

                window.scrollTo( 0, 0)
                this.onSubmitQuestionnaireValidForm( res );
            }
        } );
    }
	componentWillUnmount() {
	   pageTime= ((new Date).getTime()-this.state.date_load)/1000
	   Meteor.call("update_page","DemographicPage",pageTime)
  }

    checkErrors( callBack ) {
        var credentials = {
            "dateOfBirth": null,
            "gender": null,
            "nationality": null,
            "question1": [],            
            "question2": null,
            "twitter": null,
            "fb": null,
            "instagram": null,
            "lastfm": null,
            "spotify": null,
            "privacy": null
        };
        this.refs.dateOfBirth.checkAge(( res ) => {
            credentials.dateOfBirth = res;
            this.refs.gender.checkGender(( res ) => {
                credentials.gender = res;
                this.refs.questions.checkQuestions(( res ) => {
                    credentials.question1 = res[0];
                    credentials.question2 = res[1];
                    credentials.twitter = res[2];
                    credentials.fb = res[3];
                    credentials.instagram = res[4];
                    credentials.lastfm = res[5];
                    credentials.spotify = res[6];
                    this.refs.nationality.checkNationality(( res ) => {
                        credentials.nationality = res;
                        this.refs.privacy.checkPrivacy(( res ) => {
                            credentials.privacy = res;
                            this.setState( { is_processing: false } );
                        } );
                    } );
                } )
            } )
        } );
        callBack( credentials );
    }


    onSubmitQuestionnaireValidForm( res ) {
        this.setState( { is_processing: false, error_message: res } );
        this.setState( { questionnaire_done: true, error_message: null } );


        //SAVE DATA INTO DB
        Meteor.call("s_save_dem_questions", res, ()=> {
        });

        Meteor.call( "s_set_ini_step", "personality_questionnaire", err => {
            if ( !err )
                FlowRouter.setParams( { ini_step: "personality_questionnaire" } );
            }
         )
        //FlowRouter.go(routesPath.INI_BASE_ROUTE + routesParam.INI_STEP_0);

    }

    render() {


        return (
            <div className="row_AlignLeft" id="spacerow" >

                <h1>
                    <span style={{
                        color: '#FFFFFF',
                        textShadow: '0px 2px 5px rgba(37, 35, 40, 0.5)'
                    }}>Demographic Questionnaire</span>
                </h1>
                <div className="formauth">
                    <LoadingWrapper loading_style="loader-spinning" processing_message="test"
                        is_processing={this.state.questionnaire_done}>

                        <form className="form-demQuestionnaire" onSubmit={this.onFormQuestionnaireSubmit.bind( this )} noValidate>
                            <DateOfBirth ref="dateOfBirth" />
                            <Gender ref="gender" />
                            <Nationality ref="nationality" />
                            <Questions ref="questions" />
                            <LoadingWrapper loading_style="loader-bars" is_processing={this.state.is_processing}>
                                <Privacy ref="privacy" />
                                <div className="center_button"><input className="btn-questionnaire btn-default" type="submit" value="FINISH" /></div>
                            </LoadingWrapper>

                            <div className="colorError">
                                {( this.state.error_message )
                                    ? this.state.error_message
                                    : null}
                            </div>
                        </form >
                    </LoadingWrapper>

                </div>
            </div>
        )
    }
};
