'use strict';

const configValidate = {
    'family': ['test']   
};



module.exports = class validationFactory {
        constructor(){
            //TODO: Load Dynamic validations 
            this.validations_ = require('./testValidation.js');
        }
        get(type){
            let validations = [];
            const validationsConfig = configValidate[type];
            if (validationsConfig){
                let validationName;
                for (let i=0,len=validationsConfig.length;i<len;i++){
                    validationName = validationsConfig[i];
                    if (this.validations_[validationName]){
                         validations.push(this.validations_[validationName]);
                    }
                   
                }
            }
            return validations;
        }
};
