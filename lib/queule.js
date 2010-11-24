/*
 *  Queule JavaScript templating system, version 0.1.1
 *  (c) 2010 Daniel Hernández
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

var QueuleYield = Class.create({
  /**
   * Initialize a new yield element.
   */
  initialize: function(element, use) {
    this.element = element;
    this.use = use;
    this.previous = null;
    this.next = null;
    this.type = QueuleTemplateTypes[this.element.getAttribute('type')];
    if (this.type.is_inline()) this.container = new Element('span');
    else                       this.container = new Element('div');
    this.container.addClassName('queule-yield-container');
    this.container.update(this.element.innerHTML);
    this.element.update('').insert(this.container);
    this.setupFieldContainer();
    this.setupActionContainer();
  },
  /**
   * Setup the field container.
   */
  setupFieldContainer: function() {
    if (this.type.is_inline()) this.fieldElement = new Element('span');
    else                       this.fieldElement = new Element('div');
    this.fieldElement.addClassName('queule-field-container').update(this.container.innerHTML);
    this.container.update('').insert(this.fieldElement);
    this.field = new this.type(this);
  },
  /**
   * Setup the action container.
   */
  setupActionContainer: function() {
    if (this.type.is_inline()) this.actionContainer = new Element('span');
    else                       this.actionContainer = new Element('div');
    this.actionContainer.addClassName('queule-action-container');
    if (this.type.is_terminal()) {
      this.setupUpdateLink();
      this.setupSaveLink();
      this.setupCancelLink();
      this.saveLink.hide();
      this.cancelLink.hide();
    }
    this.setupDownLink();
    this.setupUpLink();
    if (this.element.getAttribute('delete') != 'no')
      this.setupDeleteLink();
    if (this.type.is_inline())
      this.container.insert({bottom: this.actionContainer});
    else {
      var color = this.fieldElement.childElements()[0].getStyle('background-color');
      this.actionContainer.setStyle({backgroundColor: color});
      this.container.insert({top: this.actionContainer});
    }
  },
  /**
   * Setup the update action.
   */
  setupUpdateLink: function() {
    var thisObject = this;
    this.updateLink = new Element('a', {'class':'queule-update','title':'edit'} );
    this.updateLink.update("&nbsp;&nbsp;&nbsp;");
    this.updateLink.onclick = function() { thisObject.update(); };
    this.actionContainer.insert(this.updateLink);
  },
  /**
   * Setup the delete action.
   */
  setupDeleteLink: function() {
    var thisObject = this;
    this.deleteLink = new Element('a', {'class':'queule-delete','title':'delete'});
    this.deleteLink.update("&nbsp;&nbsp;&nbsp;");
    this.deleteLink.onclick = function() { thisObject.remove(); };
    this.actionContainer.insert(this.deleteLink);
  },
  /**
   * Setup the down action.
   */
  setupDownLink: function() {
    var thisObject = this;
    this.downLink = new Element('a', {'class':'queule-down','title':'move forwards'});
    this.downLink.update("&nbsp;&nbsp;&nbsp;");
    this.downLink.onclick = function() { thisObject.down(); };
    this.actionContainer.insert(this.downLink);
  },
  /**
   * Setup the up action.
   */
  setupUpLink: function() {
    var thisObject = this;
    this.upLink = new Element('a', {'class':'queule-up','title':'move backwards'});
    this.upLink.update("&nbsp;&nbsp;&nbsp;");
    this.upLink.onclick = function() { thisObject.up(); };
    this.actionContainer.insert(this.upLink);
  },
  /**
   * Setup the save action.
   */
  setupSaveLink: function() {
    var thisObject = this;
    this.saveLink = new Element('input', {'class':'queule-save','type':'button','value':'save'});
    this.saveLink.onclick = function() { thisObject.save(); };
    this.actionContainer.insert(this.saveLink);
  },
  /**
   * Setup the cancel action.
   */
  setupCancelLink: function() {
    var thisObject = this;
    this.cancelLink = new Element('input', {'class':'queule-cancel','type':'button','value':'cancel'});
    this.cancelLink.onclick = function() { thisObject.cancel(); };
    this.actionContainer.insert(this.cancelLink);
  },
  /**
   * Remove this component.
   */
  remove: function() {
    this.element.remove();
    this.use.setupSelector(); // TODO: change this for a nofification to 'use'.
  },
  /**
   * Set this component to edit its value.
   */
  update: function(action) {
    this.updateLink.hide();
    if (this.deleteLink != undefined)
      this.deleteLink.hide();
    this.saveLink.show();
    this.cancelLink.show();
    this.inputElement = this.field.input();
    this.fieldElement.update('').insert(this.inputElement);
  },
  /**
   * Save the field.
   */
  save: function() {
    this.setDisplay();
    this.field.value = this.inputElement.getValue();
    this.field.display();
  },
  /**
   * Cancel saving the new field value.
   */
  cancel: function() {
    this.setDisplay();
    this.field.display();
  },
  /** Down */
  down: function() {
    var index = this.use.items.indexOf(this);
    this.use.items[index] = this.use.items[index + 1];
    this.use.items[index + 1] = this;
    this.upLink.show();
    this.use.items[index].downLink.show();
    this.element.remove();
    this.use.items[index].element.insert({ after: this.element });
    this.use.items.first().upLink.hide();
    this.use.items.last().downLink.hide();
  },
  /** Up */
  up: function() {
    var index = this.use.items.indexOf(this);
    this.use.items[index] = this.use.items[index - 1];
    this.use.items[index - 1] = this;
    this.downLink.show();
    this.use.items[index].upLink.show();
    this.element.remove();
    this.use.items[index].element.insert({ before: this.element });
    this.use.items.first().upLink.hide();
    this.use.items.last().downLink.hide();
  },
  /**
   * Set actions to display mode
   */
  setDisplay: function(){
    this.saveLink.hide();
    this.cancelLink.hide();
    this.updateLink.show();
    if (this.element.getAttribute('delete') != 'no') // TODO: Do we want check this all time?
      this.deleteLink.show();
  }
});

/**
 *
 */
var QueuleUse = Class.create({
  initialize: function(element) {
    this.element = element;
    if (this.element.getAttribute('types') == null) // TODO
      alert(this.element.tagName);
    this.types   = this.element.getAttribute('types').split(' ');
    this.repeat  = this.element.getAttribute('repeat') == 'true';
    this.items = new Array();
    var thisObject = this;
    this.element.childElements().each( function(element) {
      if (element.tagName == 'YIELD') {
	thisObject.items[thisObject.items.size()] = new QueuleYield(element, thisObject);
      }
    });
    if (this.items.size() > 0) {
      this.items.first().upLink.hide();
      this.items.last().downLink.hide();
    }
    var div = new Element('div', { 'class': 'queule-add' });
    this.selector = div;
    var select = new Element('select');
    for (var i = 0; i < this.types.length; i++)
      select.insert(new Element('option', { 'value' : this.types[i] }).update(this.types[i]));
    var label = this.element.getAttribute('label');
    if (label == null) {
      label = 'Add a new element';
      if (this.types.length > 1)
	label += ' of types ';
    }
    if (this.types.length == 1)
      select.hide();
    var a = new Element('a').update(label);
    var thisObject = this;
    a.onclick = function() { thisObject.insert(div); };
    div.insert(a).insert(select);
    this.element.insert({top:div});
    this.setupSelector();
  },
  setupTypeSelector: function() {
    var e = new Element('span').update(' of type ');
    this.selector.insert(e);
  },
  setupSelector: function() {
    if (this.repeat || this.element.select('yield').length < 1)
      this.selector.show();
    else
      this.selector.hide();
  },
  insert: function(element) {
    var type = this.selector.select('select')[0].getValue();
    var item = new Element('yield', { 'type': type });
    element.insert({after:item});
    yieldElement = new QueuleYield(item, this);
    if (yieldElement.type.is_terminal())
      yieldElement.update();
    this.items.unshift(yieldElement);
    yieldElement.upLink.hide();
    if (this.items.size() > 1)
      this.items[1].upLink.show();
    else yieldElement.downLink.hide();
    this.setupSelector();
  }
});
QueuleUse.activate = function(element) {
  element.select('use').each( function(use) {
    new QueuleUse(use);
  });
};

/**
 * The QueuleTemplateTypes constant include all types defined in a template.
 * It start with the basic types (QueuleTextType,...). New component
 * types must be included with the queuleParseComponents function.
 */
var QueuleTemplateTypes = { };

/**
 * The QueuleBasicType derivates represent basic types.
 */
var QueuleBasicType = Class.create({
  /**
   * Initialize a new basic type field in a template.
   */
  initialize: function(yieldElement, value) {
    this.yieldElement = yieldElement;
    this.value = this.yieldElement.fieldElement.innerHTML;
    this.display();
  },
  /**
   * Display a basic type field.
   */
  display: function() {
    var a = new Element('a', {'title':'edit'}).update(this.value);
    var yieldElement = this.yieldElement;
    a.onclick = function() { yieldElement.update(); };
    yieldElement.fieldElement.update('').insert(a);
  }
});

// Some basic types:
// -> textfield
QueuleTemplateTypes['textfield'] = Class.create(QueuleBasicType, {
  input: function() { return new Element('input', { 'type': 'text', 'value': this.value }); }
});
QueuleTemplateTypes['textfield'].is_inline = function() { return true; };
QueuleTemplateTypes['textfield'].is_terminal = function() { return true; };
// -> textarea
QueuleTemplateTypes['textarea'] = Class.create(QueuleBasicType, {
  input: function() { return new Element('textarea').update(this.value); }
});
QueuleTemplateTypes['textarea'].is_inline = function() { return true; };
QueuleTemplateTypes['textarea'].is_terminal = function() { return true; };
// -> some alias
QueuleTemplateTypes['text'] = QueuleTemplateTypes['textfield']; // text type uses textfields.

/**
 * QueuleComponentFactory creates component types classes parsing its
 * definitions in the template.
 */
var QueuleComponentFactory = Class.create({ });
QueuleComponentFactory.make = function(component) {
  var componentType = Class.create({
    component: component.innerHTML,
    initialize: function(yieldElement) {
      this.yieldElement = yieldElement;
      this.display();
    },
    display: function() {
      if (this.yieldElement.fieldElement.empty())
	this.yieldElement.fieldElement.update(this.component);
      QueuleUse.activate(this.yieldElement.fieldElement);
    }
  });
  componentType.is_inline   = function() { return false; };
  componentType.is_terminal = function() { return false; };
  return componentType;
};

/**
 * The Queule manager class.
 */
var Queule = Class.create({
  initialize: function() { Queule.start(); }
});
/**
 * The Queule.parseComponents function add component types to the template
 * available types. Template available types are stored in QueuleTemplateTypes.
 */
Queule.parseComponents = function() {
  $$('library component').each( function(element) {
    var name = element.getAttribute('name');
    QueuleTemplateTypes[name] = QueuleComponentFactory.make(element);
  });
  $$('library').each( function(element) {
    var content = element.innerHTML;
    var div = new Element('div').hide().update(content);
    element.update(div);
  });
};
/**
 * Start a Queule engine.
 */
Queule.start = function() {
  Queule.parseComponents();
  QueuleUse.activate($$("queule-body")[0]);
};