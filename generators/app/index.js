const Generator = require('yeoman-generator');
const fs = require('fs-extra');

module.exports = class extends Generator {
  initializing() {
      this.log('working');
      //this.answers = {};
  }

    async prompting() {
      this.answers = await this.prompt([
          {
              type: 'input',
              name: 'namespace',
              message: 'Namespace?'
          },{
              type: 'input',
              name: 'serviceaccountname',
              message: 'ServiceAccount:'
          },
          {
              type: 'input',
              name: 'ssh_secret_name',
              message: '[GIT] Navn på git clone ssh secret?'
          },
          {
              type: 'input',
              name: 'base64encoded_private_key',
              message: '[PRIVATE SSH] Base64 encoded ssh key:'
          },
          {
              type: 'input',
              name: 'jenkins_username',
              message: '[JENKINS] Username:'
          },
          {
              type: 'input',
              name: 'jenkins_password',
              message: '[JENKINS] Password:'
          },
          {
              type: 'input',
              name: 'sonar_access_token',
              message: '[SONAR] Sonar access token:'
          },
          {
              type: 'input',
              name: 'trigger_serviceaccountname',
              message: '[TRIGGER] ServiceAccount:'
          },
          {
              type: 'input',
              name: 'trigger_secret_name',
              message: '[TRIGGER] Webhook secret name:'
          },
          {
              type: 'input',
              name: 'webhook_secret_token_plain_text',
              message: '[TRIGGER] Webhook secret token (plain text):'
          },
          {
              type: 'list',
              name: 'host',
              choices: ['apps.dev.ocp.toll.no','apps.sandbox.ocp.toll.no'],
              message: '[TRIGGER] Host:'
          },
          {
              type: 'input',
              name: 'applicationpath',
              message: '[TRIGGER] Application path (path/to/application/):'
          },
          {
              type: 'input',
              name: 'applicationname',
              message: '[TRIGGER] Application name:'
          },
          {
              type: 'list',
              name: 'javabuilderimage',
              choices: ['java8','java11','java17'],
              message: 'Select java builder:'
          }


            ]);
        }

    writing_service_account() {

        this.fs.copyTpl(
            this.templatePath('./pipeline/ServiceAccount.yaml'),
            this.destinationPath(`openshift/pipeline/${this.answers.namespace}-ServiceAccount.yaml`),
            {
                serviceaccountname: this.answers.serviceaccountname,
                namespace: this.answers.namespace,
                ssh_secret_name: this.answers.ssh_secret_name
            });


        //const sa = require('./templates/pipeline/serviceaccount.yaml');
        //sa.name = this.answers.name;
        //sa.namespace = this.answers.namespace;

        //this.yaml.writeYamlFile(this.destinationPath('serviceaccount.yaml'), sa);

   }

    writing_bitbucket_ssh_secret() {
        this.fs.copyTpl(
            this.templatePath('./pipeline/bitbucket-ssh-Secret.yaml'),
            this.destinationPath(`openshift/pipeline/${this.answers.namespace}-git-ssh-Secret.yaml`),
            {
                ssh_secret_name: this.answers.ssh_secret_name,
                namespace: this.answers.namespace,
                base64encoded_private_key: this.answers.base64encoded_private_key
            });


        //const sa = require('./templates/pipeline/serviceaccount.yaml');
        //sa.name = this.answers.name;
        //sa.namespace = this.answers.namespace;

        //this.yaml.writeYamlFile(this.destinationPath('serviceaccount.yaml'), sa);
        
    }

    writing_create_settings_xml_script() {
        this.fs.copyTpl(
            this.templatePath('./pipeline/create-settings-xml-secret.sh'),
            this.destinationPath(`openshift/pipeline/${this.answers.namespace}-create-settings-xml-Script.sh`),
            {
                namespace: this.answers.namespace,
            });


        //const sa = require('./templates/pipeline/serviceaccount.yaml');
        //sa.name = this.answers.name;
        //sa.namespace = this.answers.namespace;

        //this.yaml.writeYamlFile(this.destinationPath('serviceaccount.yaml'), sa);

    }

    writing_granting_imagebuilding_access_to_service_account_script() {
        this.fs.copyTpl(
            this.templatePath('./pipeline/grant-access-to-service-account.sh'),
            this.destinationPath(`openshift/pipeline/${this.answers.namespace}-grant-access-to-service-account-Script.sh`),
            {
                serviceaccountname: this.answers.serviceaccountname,
            });


        //const sa = require('./templates/pipeline/serviceaccount.yaml');
        //sa.name = this.answers.name;
        //sa.namespace = this.answers.namespace;

        //this.yaml.writeYamlFile(this.destinationPath('serviceaccount.yaml'), sa);

    }

    writing_create_settings_xml_file() {
        this.fs.copyTpl(
            this.templatePath('./pipeline/settings.xml'),
            this.destinationPath(`openshift/pipeline/${this.answers.namespace}-settings.xml`),
            {
                jenkins_username: this.answers.jenkins_username,
                jenkins_password: this.answers.jenkins_password,
                sonar_access_token: this.answers.sonar_access_token
            });


        //const sa = require('./templates/pipeline/serviceaccount.yaml');
        //sa.name = this.answers.name;
        //sa.namespace = this.answers.namespace;

        //this.yaml.writeYamlFile(this.destinationPath('serviceaccount.yaml'), sa);
    }

    writing_docker_config_json_file() {
        this.fs.copyTpl(
            this.templatePath('./pipeline/registry-config.json'),
            this.destinationPath(`openshift/pipeline/${this.answers.namespace}-registry-config.json`)
        );


        //const sa = require('./templates/pipeline/serviceaccount.yaml');
        //sa.name = this.answers.name;
        //sa.namespace = this.answers.namespace;

        //this.yaml.writeYamlFile(this.destinationPath('serviceaccount.yaml'), sa);

    }

    writing_trigger_files() {
        this.fs.copyTpl(
            this.templatePath('./trigger/Route.yaml'),
            this.destinationPath(`openshift/trigger/${this.answers.applicationname}-Route.yaml`),
            {
                applicationname: this.answers.applicationname,
                namespace: this.answers.namespace,
                host: this.answers.host,
                applicationpath: this.answers.applicationpath
            });

        this.fs.copyTpl(
            this.templatePath('./trigger/RoleBinding.yaml'),
            this.destinationPath(`openshift/trigger/${this.answers.applicationname}-RoleBinding.yaml`),
            {
                applicationname: this.answers.applicationname,
                namespace: this.answers.namespace,
                trigger_serviceaccountname: this.answers.trigger_serviceaccountname
            });

        this.fs.copyTpl(
            this.templatePath('./trigger/EventListener.yaml'),
            this.destinationPath(`openshift/trigger/${this.answers.applicationname}-EventListener.yaml`),
            {
                applicationname: this.answers.applicationname,
                namespace: this.answers.namespace,
                trigger_serviceaccountname: this.answers.trigger_serviceaccountname,
                trigger_secret_name: this.answers.trigger_secret_name
            });

        this.fs.copyTpl(
            this.templatePath('./trigger/trigger-Template.yaml'),
            this.destinationPath(`openshift/trigger/${this.answers.applicationname}-TriggerTemplate.yaml`),
            {
                applicationname: this.answers.applicationname,
                namespace: this.answers.namespace,
                serviceaccountname: this.answers.serviceaccountname,
                javabuilderimage: this.answers.javabuilderimage
            });




        //const sa = require('./templates/pipeline/serviceaccount.yaml');
        //sa.name = this.answers.name;
        //sa.namespace = this.answers.namespace;

        //this.yaml.writeYamlFile(this.destinationPath('serviceaccount.yaml'), sa);

    }
};