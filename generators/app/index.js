const Generator = require('yeoman-generator');
const fs = require('fs-extra');

module.exports = class extends Generator {
  initializing() {
      this.log('working');
      this.props = {};
      this.pkgs = {
          defaultPkgs: [
              'dotenv'
          ],
          expPkgs: [
            'body-parser',
            'cookie-parser',
            'cookie-session',
          ],
          restPkgs: [
              'restify',
              'jsonwebtoken',
              'jwtdecode',
              'node-cache',
          ],
          defaultDevPkgs: [
              'madge'
          ],
          expDevPkgs: [

          ],
          restDevPkgs: []
      };
  }

  async prompting() {
      const props = await this.prompt([
          {
              type: 'input',
              name: 'name',
              message: 'What is your applications name'
          },
          {
              type: 'input',
              name: 'description',
              message: 'Please enter a description of your project:'
          },
          {
              type: 'input',
              name: 'fullname',
              message: 'Please enter your name:'
          },
          {
              type: 'input',
              name: 'email',
              message: 'Please enter your email address:'
          },
          {
              type: 'input',
              name: 'repo',
              message: 'Please enter the url for the Github repository:'
          },
          {
              type: 'list',
              name: 'stack',
              choices: ['nodejs', 'angular'],
              message: 'Which tech stack are you using?'
          },
          {
              type: 'list',
              name: 'app',
              choices: ['package','express web app','restify API'],
              message: 'What type of application are you building?'
          }
      ]);
      this.props.name = props.name;
      this.props.description = props.description;
      this.props.fullname = props.fullname;
      this.props.email = props.email;
      this.props.repo = props.repo;
      this.props.stack = props.stack;
      this.props.app = props.app;
  }
  async configuration() {
      this.log('Started copying files...');
      try {
          await fs.copy(`${this.sourceRoot()}`, `${this.destinationRoot()}`);
      } catch (e) {
          this.log(e);
      }
  }
  writing() {
    this.log('writing');
    const pkg = require('../../package.json');
    pkg.name = this.props.name;
    pkg.version = this.props.version;
    pkg.description = this.props.description;
    pkg.files = undefined;
    pkg.keywords = undefined;

    this.fs.writeJSON(this.destinationPath('package.json'), pkg);
    this.log('Finished writing package.json file');

  }
  install() {
      this.log('writing ');
      const pkgs = this.pkgs.defaultPkgs;

  }
  end() {
      this.log('Happy coding');
  }
};