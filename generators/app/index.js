const Generator = require('yeoman-generator');
const fs = require('fs-extra');

module.exports = class extends Generator {
  initializing() {
      this.log('working');
      this.props = {};
  }

    async prompting() {
        const props = await this.prompt([
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

        this.props.serviceaccountname = props.serviceaccountname;
        this.props.namespace = props.namespace;
        this.props.ssh_secret_name = props.ssh_secret_name;
        this.props.base64encoded_private_key = props.base64encoded_private_key;
        this.props.jenkins_username = props.jenkins_username;
        this.props.jenkins_password = props.jenkins_password;
        this.props.sonar_access_token = props.sonar_access_token;

        this.props.applicationname = props.applicationname;
        this.props.applicationpath = props.applicationpath;
        this.props.javabuilderimage = props.javabuilderimage;
        this.props.host = props.host;
        this.props.trigger_serviceaccountname = props.trigger_serviceaccountname;
        this.props.webhook_secret_token_plain_text = props.webhook_secret_token_plain_text;
        this.props.trigger_secret_name = props.trigger_secret_name;
  }


    writing_service_account() {
        this.log('writing');
        this.log(`Service account name: ${this.props.serviceaccountname}`);
        this.log(`Namespace: ${this.props.namespace}`);

        this.fs.copyTpl(
            this.templatePath('./pipeline/ServiceAccount.yaml'),
            this.destinationPath(`openshift/pipeline/${this.props.namespace}-ServiceAccount.yaml`),
            {
                serviceaccountname: this.props.serviceaccountname,
                namespace: this.props.namespace,
                ssh_secret_name: this.props.ssh_secret_name
            });


        //const sa = require('./templates/pipeline/serviceaccount.yaml');
        //sa.name = this.props.name;
        //sa.namespace = this.props.namespace;

        //this.yaml.writeYamlFile(this.destinationPath('serviceaccount.yaml'), sa);
        this.log('Finished writing yaml files');
   }

    writing_bitbucket_ssh_secret() {
        this.fs.copyTpl(
            this.templatePath('./pipeline/bitbucket-ssh-Secret.yaml'),
            this.destinationPath(`openshift/pipeline/${this.props.namespace}-git-ssh-Secret.yaml`),
            {
                ssh_secret_name: this.props.ssh_secret_name,
                namespace: this.props.namespace,
                base64encoded_private_key: this.props.base64encoded_private_key
            });


        //const sa = require('./templates/pipeline/serviceaccount.yaml');
        //sa.name = this.props.name;
        //sa.namespace = this.props.namespace;

        //this.yaml.writeYamlFile(this.destinationPath('serviceaccount.yaml'), sa);
        this.log('Finished writing yaml files');
    }

    writing_create_settings_xml_script() {
        this.fs.copyTpl(
            this.templatePath('./pipeline/create-settings-xml-secret.sh'),
            this.destinationPath(`openshift/pipeline/${this.props.namespace}-create-settings-xml-Script.sh`),
            {
                namespace: this.props.namespace,
            });


        //const sa = require('./templates/pipeline/serviceaccount.yaml');
        //sa.name = this.props.name;
        //sa.namespace = this.props.namespace;

        //this.yaml.writeYamlFile(this.destinationPath('serviceaccount.yaml'), sa);
        this.log('Finished writing yaml files');
    }

    writing_granting_imagebuilding_access_to_service_account_script() {
        this.fs.copyTpl(
            this.templatePath('./pipeline/grant-access-to-service-account.sh'),
            this.destinationPath(`openshift/pipeline/${this.props.namespace}-grant-access-to-service-account-Script.sh`),
            {
                serviceaccountname: this.props.serviceaccountname,
            });


        //const sa = require('./templates/pipeline/serviceaccount.yaml');
        //sa.name = this.props.name;
        //sa.namespace = this.props.namespace;

        //this.yaml.writeYamlFile(this.destinationPath('serviceaccount.yaml'), sa);
        this.log('Finished writing yaml files');
    }

    writing_create_settings_xml_file() {
        this.fs.copyTpl(
            this.templatePath('./pipeline/settings.xml'),
            this.destinationPath(`openshift/pipeline/${this.props.namespace}-settings.xml`),
            {
                jenkins_username: this.props.jenkins_username,
                jenkins_password: this.props.jenkins_password,
                sonar_access_token: this.props.sonar_access_token
            });


        //const sa = require('./templates/pipeline/serviceaccount.yaml');
        //sa.name = this.props.name;
        //sa.namespace = this.props.namespace;

        //this.yaml.writeYamlFile(this.destinationPath('serviceaccount.yaml'), sa);
        this.log('Finished writing yaml files');
    }

    writing_docker_config_json_file() {
        this.fs.copyTpl(
            this.templatePath('./pipeline/registry-config.json'),
            this.destinationPath(`openshift/pipeline/${this.props.namespace}-registry-config.json`)
        );


        //const sa = require('./templates/pipeline/serviceaccount.yaml');
        //sa.name = this.props.name;
        //sa.namespace = this.props.namespace;

        //this.yaml.writeYamlFile(this.destinationPath('serviceaccount.yaml'), sa);
        this.log('Finished writing yaml files');
    }

    writing_trigger_files() {
        this.fs.copyTpl(
            this.templatePath('./trigger/Route.yaml'),
            this.destinationPath(`openshift/trigger/${this.props.applicationname}-Route.yaml`),
            {
                applicationname: this.props.applicationname,
                namespace: this.props.namespace,
                host: this.props.host,
                applicationpath: this.props.applicationpath
            });

        this.fs.copyTpl(
            this.templatePath('./trigger/RoleBinding.yaml'),
            this.destinationPath(`openshift/trigger/${this.props.applicationname}-RoleBinding.yaml`),
            {
                applicationname: this.props.applicationname,
                namespace: this.props.namespace,
                trigger_serviceaccountname: this.props.trigger_serviceaccountname
            });

        this.fs.copyTpl(
            this.templatePath('./trigger/EventListener.yaml'),
            this.destinationPath(`openshift/trigger/${this.props.applicationname}-EventListener.yaml`),
            {
                applicationname: this.props.applicationname,
                namespace: this.props.namespace,
                trigger_serviceaccountname: this.props.trigger_serviceaccountname,
                trigger_secret_name: this.props.trigger_secret_name
            });

        this.fs.copyTpl(
            this.templatePath('./trigger/trigger-Template.yaml'),
            this.destinationPath(`openshift/trigger/${this.props.applicationname}-TriggerTemplate.yaml`),
            {
                applicationname: this.props.applicationname,
                namespace: this.props.namespace,
                serviceaccountname: this.props.serviceaccountname,
                javabuilderimage: this.props.javabuilderimage
            });




        //const sa = require('./templates/pipeline/serviceaccount.yaml');
        //sa.name = this.props.name;
        //sa.namespace = this.props.namespace;

        //this.yaml.writeYamlFile(this.destinationPath('serviceaccount.yaml'), sa);
        this.log('Finished writing yaml files');
    }
};