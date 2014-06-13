{View} = require 'atom'

module.exports =
class PathToModuleView extends View
  @content: ->
    @div class: 'path-to-module overlay from-top', =>
      @div "The PathToModule package is Alive! It's ALIVE!", class: "message"

  initialize: (serializeState) ->
    atom.workspaceView.command "path-to-module:toggle", => @toggle()

  # Returns an object that can be retrieved when package is activated
  serialize: ->

  # Tear down any state and detach
  destroy: ->
    @detach()

  toggle: ->
    console.log "PathToModuleView was toggled!"
    if @hasParent()
      @detach()
    else
      atom.workspaceView.append(this)
