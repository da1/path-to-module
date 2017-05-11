'use babel';

import PathToModuleView from './path-to-module-view';
import { CompositeDisposable } from 'atom';

export default {

  pathToModuleView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.pathToModuleView = new PathToModuleView(state.pathToModuleViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.pathToModuleView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'path-to-module:toggle': () => this.toggle(),
      'path-to-module:file2module': () => this.file2module(),
      'path-to-module:module2file': () => this.module2file()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.pathToModuleView.destroy();
  },

  serialize() {
    return {
      pathToModuleViewState: this.pathToModuleView.serialize()
    };
  },

  getRelativePath() {
      uri = atom.workspace.getActivePaneItem().getURI();
      rootDirectory = atom.project.rootDirectories[0];
      directoryPath = rootDirectory.getPath();
      return uri.substr(directoryPath.length + 1);
  },

  getAbsolutePath(file, prefix, extention) {
      path = atom.project.rootDirectories[0].getPath();
      return path + "/" + prefix + file + extention;
  },

  file2module() {
      relativePath = this.getRelativePath();
      moduleName = relativePath.replace(/^(t\/)?lib\//, '').replace(/\.(pm|t)$/, '').replace(/\//g, '::')
      atom.workspace.getActivePaneItem().insertText(moduleName)
  },

  module2file() {
      prefix = "lib/";
      ext    = ".pm";
      moduleName = atom.workspace.getActivePaneItem().getSelectedText();
      file = moduleName.replace(/::/g, '/');

      atom.clipboard.write(file);
      absPath = this.getAbsolutePath(file, prefix, ext);

      atom.workspace.open(absPath);
  },

  toggle() {
    console.log('PathToModule was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
