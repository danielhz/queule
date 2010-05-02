/*
 Queule JavaScript templating system, version 0.1.1
 (c) 2010 Daniel Hernández

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/**
 * Queule types are instances to edit in a document.
 *
 * A queule type is an abstract class that can be extended by
 * derivated types.
 */
var QueuleType = Class.create({
  /**
   * Initialize a type
   */
   initialize: function(element, id) {
     this.element = element;
     this.element.writeAttribute('id', id);
     this.element.setStyle({ color: 'green'}); // testing
   },
   /**
    * Read the element id
    */
   id: function() {
     this.element.readAttribute('id');
   }
});

/**
 * Queule template is the class that manage the document edition.
 */
var QueuleTemplate = new (Class.create({

  /**
   * Initialize a new queule template
   */
   initialize: function() {
     this.idSequence = 0;
     this.templateNamespace = "q";
     this.idPrefix = "queule";
     this.types = { };
  },

  /**
   * Set id prefix
   */
  setIdPrefix: function(idPrefix) {
    this.idPrefix = prefix;
  },

  /**
   * Add a type to the types dictionary.
   */
  addType: function(name, typeClass) {
    this.types[name] = typeClass;
  },

  /**
   * Initialize a type with an element
   */
  initializeType: function(element) {
    var type = this.types["string"];
    var id = this.idPrefix + ":" + (this.idSequence += 1);
    return new type(element, id);
  },

  /**
   * Manage
   */
  manage: function() {
    var elements =
      document.getElementsByTagName(this.templateNamespace + ":use");
    // ASSERT: elements is a HTMLCollection
    for(i=0; i< elements.length; i++) {
      this.initializeType(elements.item(i));
    }
  }
}))();

/**
 * A basic string type
 */
QueuleTemplate.addType('string', Class.create(QueuleType, {
}));