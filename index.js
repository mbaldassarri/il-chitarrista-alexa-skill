"use strict";

const Alexa = require('alexa-sdk');
const APP_ID = undefined; //Optional
let speechOutput;
let reprompt;
let audioSrc;
let selectedSpeech;
let welcomeOutput = "Benvenuto dal chitarrista 2 punto 0. Chiedimi una nota per accordare la tua chitarra, o un accordo maggiore o minore.";
let welcomeReprompt = 'Che cosa posso suonare per te?';
speechOutput = '';
reprompt = '';
audioSrc = '';
selectedSpeech  = '';

const handlers = {
    'LaunchRequest': function () {
        this.emit(':ask', welcomeOutput, welcomeReprompt);
    },
    'AMAZON.HelpIntent': function () {
        speechOutput = 'Il chitarrista 2 punto 0 può aiutarti ad accordare la tua chitarra imparare gli accordi. Chiedimi di riprodurre una nota o un accordo maggiore o minore!';
        reprompt = 'Attenzione! non supporto gli accordi aumentati, diminuiti o di settima. Prova a dire: fammi sentire un mi cantino, oppure: suonami un accordo di la minore!';
        this.emit(':ask', speechOutput, reprompt);
    },
   'AMAZON.CancelIntent': function () {
        speechOutput = 'D\'accordo, smetto di suonare.'
        this.emit(':tell', speechOutput);
    },
   'AMAZON.StopIntent': function () {
        speechOutput = 'Ciao musicista! <emphasis level="reduced"> ci si becca in giro!</emphasis>';
        this.emit(':tellWithCard', speechOutput, 'Grazie per aver scelto il Chitarrista 2 punto 0!', 'Ricordati di ascoltare tanta buona Musica!');
   },
   'SessionEndedRequest': function () {
        speechOutput = '';
        this.emit(':tell', speechOutput);
   },
    'AMAZON.NavigateHomeIntent': function () {
        speechOutput = 'Arrivederci a presto!';
        this.emit(":tell", speechOutput);
    },
    "PlayNoteIntent": function () {
		var speechOutput = '';
        var speechReprompt = '';
		var noteSlot = resolveCanonical(this.event.request.intent.slots.note);
		var pitchSlot = resolveCanonical(this.event.request.intent.slots.pitch);
        
        var urlPath = 'https://YOUR_NOTES_URL';
		var notes = {
		    'mi' : {
		        'alto' : urlPath + 'e_high.mp3',
		        'cantino': urlPath + 'e_high.mp3',
		        'basso': urlPath + 'e_low.mp3'
		    },
		    'la' : {
		        'alto' : urlPath + 'a.mp3',
		        'cantino': urlPath + 'a.mp3',
		        'basso': urlPath + 'a.mp3'
		    },
		    're' : {
		        'alto' : urlPath + 'd.mp3',
		        'cantino': urlPath + 'd.mp3',
		        'basso': urlPath + 'd.mp3'
		    },
		    'sol' : {
		        'alto' : urlPath + 'g.mp3',
		        'cantino': urlPath + 'g.mp3',
		        'basso': urlPath + 'g.mp3'
		    },
		    'si' : {
		        'alto' : urlPath + 'b.mp3',
		        'cantino': urlPath + 'b.mp3',
		        'basso': urlPath + 'b.mp3'
		    }
		}

        var pitches = [
            'alto',
            'cantino',
            'basso'
        ];
        
        var note = '';
        var pitch = '';
                
        if(!noteSlot) {
            this.emit(':ask', 'Non ho sentito bene, Di che nota o accordo si tratta?', 'Mi puoi chiedere qualcosa tipo suona la nota Mi cantino')
        } else {
            note = noteSlot.toLowerCase();
            this.attributes['note'] = note;
        }

        if(notes[note]) {
            pitch = '';
            if(pitchSlot && pitches.indexOf(pitchSlot.toLowerCase()) > -1) {
                
                pitch = pitchSlot;
                
            } else {
                pitch = 'basso';
            }
            
            audioSrc = notes[note][pitch]; //URL path
            var outputPitch = pitch === 'basso' ? pitch = '' : pitch;
            
            //if somebody selects a non E string with high pitch, this check is to say that a low pitch is available and that it will be played
            if((noteSlot !== 'mi') && (pitch === pitches[0] || pitch === pitches[1])) {
                outputPitch = '';
            }
            selectedSpeech = noteSlot + ' ' + outputPitch;


            var textArray = [
                'Ecco per te il ',
                'Ecco a te il ',
                'Ti suono il ',
                'Ascolta il ',
                ' '
            ]
            var randomIndex = Math.floor(Math.random() * textArray.length); 
            var randomResponseIncipit = textArray[randomIndex];

            speechOutput = randomResponseIncipit + selectedSpeech + ': <audio src="' + audioSrc + '" /> Che cosa vorresti ascoltare adesso?';
            speechReprompt = 'Chiedimi di suonare una nota o un accordo. Che cosa vuoi sentire?';
        } else {
            speechOutput = 'Mi dispiace, non conosco la nota o l\'accordo che mi hai chiesto.'
            
        }

        var cardTitle = 'Sto suonando la nota ' + selectedSpeech;
        var cardSubtitle = 'Te la farò ascoltare qualche volta, ma puoi riascoltarla tutte le volte che vuoi. Basta chiedere!';
        this.emit(":askWithCard", speechOutput, speechReprompt, cardTitle, cardSubtitle); 
    },
    "PlayChordIntent": function () {
		var speechOutput = '';
        var speechReprompt = '';
		var chordSlot = resolveCanonical(this.event.request.intent.slots.note);
		var typeSlot = resolveCanonical(this.event.request.intent.slots.chordtype);
		var urlPath = 'https://YOUR_CHORDS_URL';
		var chords = {
		    'do' : {
		        'maggiore' : urlPath + 'c_maj.mp3',
		        'minore': urlPath + 'c_min.mp3'
            },
            'do diesis' : {
		        'maggiore' : urlPath + 'c_diesis_maj.mp3',
		        'minore': urlPath + 'c_diesis_min.mp3'
            },
            're bemolle' : {
		        'maggiore' : urlPath + 'c_diesis_maj.mp3',
		        'minore': urlPath + 'c_diesis_min.mp3'
		    },
		    're' : {
                'maggiore' : urlPath + 'd_maj.mp3',
		        'minore': urlPath + 'd_min.mp3'
            },
            're diesis' : {
		        'maggiore' : urlPath + 'd_diesis_maj.mp3',
		        'minore': urlPath + 'd_diesis_min.mp3'
            },
            'mi bemolle' : {
                'maggiore' : urlPath + 'd_diesis_maj.mp3',
		        'minore': urlPath + 'd_diesis_min.mp3'
		    },
		    'mi' : {
                'maggiore' : urlPath + 'e_maj.mp3',
		        'minore': urlPath + 'e_min.mp3'
            },
		    'fa' : {
                'maggiore' : urlPath + 'f_maj.mp3',
		        'minore': urlPath + 'f_min.mp3'
            },
            'fa diesis' : {
		        'maggiore' : urlPath + 'f_diesis_maj.mp3',
		        'minore': urlPath + 'f_diesis_min.mp3'
            },
            'sol bemolle' : {
                'maggiore' : urlPath + 'f_diesis_maj.mp3',
		        'minore': urlPath + 'f_diesis_min.mp3'
		    },
		    'sol' : {
                'maggiore' : urlPath + 'g_maj.mp3',
		        'minore': urlPath + 'g_min.mp3'
            },
            'sol diesis' : {
		        'maggiore' : urlPath + 'g_diesis_maj.mp3',
		        'minore': urlPath + 'g_diesis_min.mp3'
            },
            'la bemolle' : {
                'maggiore' : urlPath + 'g_diesis_maj.mp3',
		        'minore': urlPath + 'g_diesis_min.mp3'
		    },
            'la' : {
                'maggiore' : urlPath + 'a_maj.mp3',
		        'minore': urlPath + 'a_min.mp3'
            },
            'la diesis' : {
		        'maggiore' : urlPath + 'a_diesis_maj.mp3',
		        'minore': urlPath + 'a_diesis_min.mp3'
            },
            'si bemolle' : {
		        'maggiore' : urlPath + 'a_diesis_maj.mp3',
		        'minore': urlPath + 'a_diesis_min.mp3'
		    },
            'si' : {
                'maggiore' : urlPath + 'b_maj.mp3',
		        'minore': urlPath + 'b_min.mp3'
		    }
		}

        var types = [
            'maggiore',
            'minore'
        ];
        
        var chord = '';
        var type = '';
                
        if(!chordSlot) {
             this.emit(':ask', 'Non ho sentito bene. Di che nota o accordo si tratta?', 'Mi puoi chiedere qualcosa tipo suona la nota Mi cantino')
        } else {
            chord = chordSlot.toLowerCase();
            this.attributes['chord'] = chord;
        }
        
        if(chords[chord]) {
            type = 'maggiore';
            if(typeSlot && types.indexOf(typeSlot.toLowerCase()) > -1) {
                type = typeSlot;    
            }
            
            audioSrc = chords[chord][type];
            
            selectedSpeech = chordSlot + ' ' + type;
            
            var textArray = [
                'Ecco per te un accordo ',
                'Ecco a te un ',
                'Accordo ',
                ' ',
                'Ti suono un ',
                'Ascolta il '
            ]
            var randomIndex = Math.floor(Math.random() * textArray.length); 
            var randomResponseIncipit = textArray[randomIndex];

            speechOutput = randomResponseIncipit + selectedSpeech + ': <audio src="' + audioSrc + '" /> Chiedimi di nuovo una nota per accordare la tua chitarra, o un accordo maggiore o minore.';
            speechReprompt = 'Che cosa vuoi ascoltare?';
        } else {
            speechOutput = 'Mi dispiace, non conosco la nota o l\'accordo che mi hai chiesto.'
            speechReprompt = 'Posso riprodurre ad esempio un sol minore, maggiore una nota per accordare la tua chitarra. Cosa ti suono?';
        }
        var cardTitle = 'Sto suonando l\' accordo ' + selectedSpeech;
        var cardSubtitle = 'Ci sono tante canzoni che usano questo accordo :) ';
        this.emit(":ask", speechOutput, speechReprompt, cardTitle, cardSubtitle);
    },		
    'AMAZON.YesIntent': function () {
    },
    'AMAZON.NoIntent': function () {
        this.emit('StopIntent');
    },
    'AskGuitarTuningIntent': function () {
        speechOutput = 'Certamente, che nota vorresti accordare?';
        var speechReprompt = 'Per esempio, chiedimi di suonare un mi cantino, un la, un sol, un mi basso';
        this.emit(':ask', speechOutput, speechReprompt);
    },
    'AskPlayChordIntent': function () {
        speechOutput = 'Va bene, che accordo ti posso suonare?';
        var speechReprompt = 'Ad esempio, puoi chiedermi di suonarti un sol maggiore, o un la minore';
        this.emit(':ask', speechOutput, speechReprompt);
    },
    'Unhandled': function () {
        speechOutput = "Il chitarrista 2 punto 0 non ha capito che cosa hai chiesto. Vuoi accordare la tua chitarra? Chiedimi di suonare una nota.";
        this.emit(':ask', speechOutput, speechOutput);
    }
};

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

function resolveCanonical(slot){
    let canonical;
    try{
        canonical = slot.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    }catch(err){
        console.log(err.message);
        canonical = slot.value;
    };
    return canonical;
};

function delegateSlotCollection(){
  console.log("in delegateSlotCollection");
  console.log("current dialogState: "+this.event.request.dialogState);
    if (this.event.request.dialogState === "STARTED") {
      console.log("in Beginning");
      let updatedIntent= null;
      if(this.isOverridden()) {
            return;
        }
        this.handler.response = buildSpeechletResponse({
            sessionAttributes: this.attributes,
            directives: getDialogDirectives('Dialog.Delegate', updatedIntent, null),
            shouldEndSession: false
        });
        this.emit(':responseReady', updatedIntent);
        
    } else if (this.event.request.dialogState !== "COMPLETED") {
      console.log("in not completed");
        if(this.isOverridden()) {
            return;
        }
        this.handler.response = buildSpeechletResponse({
            sessionAttributes: this.attributes,
            directives: getDialogDirectives('Dialog.Delegate', null, null),
            shouldEndSession: false
        });
        this.emit(':responseReady');
        
    } else {
      console.log("in completed");
      console.log("returning: "+ JSON.stringify(this.event.request.intent));
      return this.event.request.intent;
    }
}


function randomPhrase(array) {
    let i = 0;
    i = Math.floor(Math.random() * array.length);
    return(array[i]);
}
function isSlotValid(request, slotName){
        let slot = request.intent.slots[slotName];
        let slotValue;

        if (slot && slot.value) {
            slotValue = slot.value.toLowerCase();
            return slotValue;
        } else {
            return false;
        }
}

function createSpeechObject(optionsParam) {
    if (optionsParam && optionsParam.type === 'SSML') {
        return {
            type: optionsParam.type,
            ssml: optionsParam['speech']
        };
    } else {
        return {
            type: optionsParam.type || 'PlainText',
            text: optionsParam['speech'] || optionsParam
        };
    }
}

function buildSpeechletResponse(options) {
    let alexaResponse = {
        shouldEndSession: options.shouldEndSession
    };

    if (options.output) {
        alexaResponse.outputSpeech = createSpeechObject(options.output);
    }

    if (options.reprompt) {
        alexaResponse.reprompt = {
            outputSpeech: createSpeechObject(options.reprompt)
        };
    }

    if (options.directives) {
        alexaResponse.directives = options.directives;
    }

    if (options.cardTitle && options.cardContent) {
        alexaResponse.card = {
            type: 'Simple',
            title: options.cardTitle,
            content: options.cardContent
        };

        if(options.cardImage && (options.cardImage.smallImageUrl || options.cardImage.largeImageUrl)) {
            alexaResponse.card.type = 'Standard';
            alexaResponse.card['image'] = {};

            delete alexaResponse.card.content;
            alexaResponse.card.text = options.cardContent;

            if(options.cardImage.smallImageUrl) {
                alexaResponse.card.image['smallImageUrl'] = options.cardImage.smallImageUrl;
            }

            if(options.cardImage.largeImageUrl) {
                alexaResponse.card.image['largeImageUrl'] = options.cardImage.largeImageUrl;
            }
        }
    } else if (options.cardType === 'LinkAccount') {
        alexaResponse.card = {
            type: 'LinkAccount'
        };
    } else if (options.cardType === 'AskForPermissionsConsent') {
        alexaResponse.card = {
            type: 'AskForPermissionsConsent',
            permissions: options.permissions
        };
    }

    let returnResult = {
        version: '1.0',
        response: alexaResponse
    };

    if (options.sessionAttributes) {
        returnResult.sessionAttributes = options.sessionAttributes;
    }
    return returnResult;
}

function getDialogDirectives(dialogType, updatedIntent, slotName) {
    let directive = {
        type: dialogType
    };

    if (dialogType === 'Dialog.ElicitSlot') {
        directive.slotToElicit = slotName;
    } else if (dialogType === 'Dialog.ConfirmSlot') {
        directive.slotToConfirm = slotName;
    }

    if (updatedIntent) {
        directive.updatedIntent = updatedIntent;
    }
    return [directive];
}