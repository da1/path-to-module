PathToModuleView = require './path-to-module-view'

module.exports =
  pathToModuleView: null

  activate: (state) ->
    @pathToModuleView = new PathToModuleView(state.pathToModuleViewState)
    atom.workspaceView.command "path-to-module:file2module", => @file2module()
    atom.workspaceView.command "path-to-module:module2file", => @module2file()

  deactivate: ->
    @pathToModuleView.destroy()

  serialize: ->
    pathToModuleViewState: @pathToModuleView.serialize()

  file2module: ->
    relativePath = @getRelativePath()
    moduleName = relativePath.replace(/^(t\/)?lib\//, '').replace(/\.(pm|t)$/, '').replace(/\//g, '::');
    atom.workspace.activePaneItem.insertText(moduleName);

  getRelativePath: ->
    uri = atom.workspace.activePaneItem.getUri()
    rootDirectory = atom.project.rootDirectory
    directoryPath = rootDirectory.getPath()
    return uri.substr(directoryPath.length + 1)

  module2file: ->
    module = atom.clipboard.read()
    file = module.replace(/::/g, '/')
    atom.clipboard.write(file)
