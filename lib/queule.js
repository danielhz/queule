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
  initialize: function(element, use) {
    this.element = element;
    this.use = use;
    var type = QueuleTemplateTypes[this.element.getAttribute('type')];
    this.content = new type(this);
    if (this.element.getAttribute('delete') != 'no') {
      var a = new Element('a', { 'class': 'queule-delete', 'href': '#', 'title': 'delete' }).update("&nbsp;&nbsp;&nbsp;&nbsp;");
      var thisObject = this;
      a.onclick = function() { thisObject.remove(); };
      this.element.insert(a);
    }
  },
  remove: function() {
    this.element.remove();
    this.use.setupSelector();
  }
});

var QueuleUse = Class.create({
  initialize: function(element) {
    this.element = element;
    if (this.element.getAttribute('types') == null) // TODO
      alert(this.element.tagName);
    this.types   = this.element.getAttribute('types').split(' ');
    this.repeat  = this.element.getAttribute('repeat') == 'true';
    //this.items   = new Array();
    var items = this.element.select('yield');
    for (i = 0; i < items.length; i++)
      new QueuleYield(items[i], this);
      //this.items.push(new QueuleYield(items[i], this));
    var div = new Element('div', { 'class': 'queule-add' });
    this.selector = div;
    var select = new Element('select');
    for (var i = 0; i < this.types.length; i++)
      select.insert(new Element('option', { 'value' : this.types[i] }).update(this.types[i]));
    // this label...
    var label = this.element.getAttribute('label');
    if (label == null) {
      label = 'Add a new element';
      if (this.types.length > 1)
	label += ' of types ';
    }
    if (this.types.length == 1)
      select.hide();
    var a = new Element('a', { 'href': '#' }).update('(' + label + ')');
    var thisObject = this;
    a.onclick = function() { thisObject.insert(); };
    div.insert(a).insert(select);
    this.element.insert(div);
    //this.setupTypeSelector();
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
  insert: function() {
    var type = this.selector.select('select')[0].getValue();
    var item = new Element('yield', { 'type': type });
    this.element.insert(item);
    new QueuleYield(item, this);
    this.setupSelector();
  }
});

function queuleUseActivate(element) {
  element.select('use').each( function(use) {
    new QueuleUse(use);
  });
}

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
  initialize: function(yieldElement) {
    this.yieldElement = yieldElement;
    this.value = this.yieldElement.element.innerHTML;
    this.display();
  },
  /**
   * Display a basic type field.
   */
  display: function() {
    var a = new Element('a', { 'class': 'queule-field', 'href': '#', 'title': 'edit'} ).update(this.value);
    var yieldElement = this.yieldElement;
    a.onclick = function() { yieldElement.content.update(); };
    yieldElement.element.update('').insert(a);
  },
  /**
   * Save the field.
   */
  save: function() {
    this.value = this.yieldElement.element.select('input')[0].getValue();
    this.display();
  }
});

/**
 * The text type uses text-fields.
 */
QueuleTemplateTypes['text'] = Class.create(QueuleBasicType, {
  update: function() {
    var input = new Element('input', { 'type': 'text', 'value': this.value });
    var a     = new Element('a', { 'class': 'queule-yield-edit-link', 'href': '#' }).update('(save)');
    var yieldElement = this.yieldElement;
    var inputId      = input.identify();
    a.onclick = function() { yieldElement.content.save(); };
    yieldElement.element.update('').insert(input).insert(a);
  }
});

/**
 * The textarea type uses textarea inputs.
 */
QueuleTemplateTypes['textarea'] = Class.create(QueuleBasicType, {
  update: function() {
    var input = new Element('textarea', { 'value': this.value }).update(this.value);
    var a     = new Element('a', { 'class': 'queule-yield-edit-link', 'href': '#' }).update('(save)');
    var yieldElement = this.yieldElement;
    var inputId      = input.identify();
    a.onclick = function() { yieldElement.content.save(); };
    yieldElement.element.update('').insert(input).insert(a);
  },
  /**
   * Save the field.
   */
  save: function() {
    this.value = this.yieldElement.element.select('textarea')[0].getValue();
    this.display();
  }
});

function queuleComponentFactory(component) {
  var componentType = Class.create({
    component: component.innerHTML,
    initialize: function(yieldElement) {
      this.yieldElement = yieldElement;
      this.display();
    },
    display: function() {
      //alert(this.yieldElement);
      this.yieldElement.element.update(this.component);
      queuleUseActivate(this.yieldElement.element);
    }
  });
  return componentType;
}

/**
 * The queuleParseComponents function add component types to the template
 * available types. Template available types are stored in QueuleTemplateTypes.
 */
function queuleParseComponents() {
  $$('library component').each( function(element) {
    var name = element.getAttribute('name');
    QueuleTemplateTypes[name] = queuleComponentFactory(element);
  });
  $$('library').each( function(element) {
    var content = element.innerHTML;
    var div = new Element('div').hide().update(content);
    element.update(div);
  });
}

var QueuleFactory = Class.create({
  make: function(element) {
    if (element.nodeName == "USE")   { return new QueuleUse(element); }
    //if (element.nodeName == "YIELD") { return new QueuleYield(element); }
    return null;
  }
});

var QueuleManager = Class.create({
  initialize: function() {
    this.factory = new QueuleFactory();
  },
  setup: function(elements) {
    for (var i = 0; i < elements.size(); i++)
      this.factory.make(elements[i]);
  },
  /**
   * The readComponents function search the component types defined in
   * the template and insert them into the QueuleTemplateTypes global
   * variable.
   */
  readComponents: function() {
    //
  }
});

var queuleManager = new QueuleManager();

function startQueule() {
  queuleParseComponents();
  var components = $$("component");
  //alert(components.length);
  // for (i = 0; i < components.length; i++)
  //   components[i].remove();
  var elements = $$("queule-body")[0].select("use");
  //alert(elements.length);
  queuleManager.setup(elements);

  // elements = $$("use p");
  // for (i = 0; i < elements.size(); i++) {
  //   elements[i].setStyle({color: 'green'});
  //   if (elements[i].getAttribute('id') == null)
  //     alert('es null');
  // }
}