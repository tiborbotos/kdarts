/// <reference path="./../references.d.ts" />
var kdarts;
(function (kdarts) {
    var base;
    (function (base) {
        /**
         * Base class for TypeScript directives with default configuration, and with the possibility to create a default
         * link function.
         *
         * This base class makes sure that everything what's defined in it's subclass will be copied to the directive's scope
         * in the linking phrase (scope here means the actual parameters, not the directive's scope configuration).
         * This is done by coping injected fields and methods from the subclass prototype. That way we can still get type
         * safety, and look like our directive is a class, but actually it has two parts:
         *  - the factory (constructor, and static Factory method) and
         *  - the methods and fields copied into the scope
         *
         * Copied methods will be bind to scope, so 'this' will be the scope object in runtime, but that's just a copy of
         * the subclass, so you can create the directive type safe!
         */
        var Directive = (function () {
            function Directive(clazz, afterLinkingFn) {
                if (clazz === void 0) { clazz = undefined; }
                this.restrict = 'E';
                this.replace = true;
                if (clazz !== undefined) {
                    var directive = this;
                    directive.link = function (scope, element, attrs) {
                        // copy variables (mostly dependencies) into scope so they can be accessed with 'this'
                        mapFieldsAndFunctionsIntoScope(scope, directive);
                        // copy functions into scope and bind them to the scope, so their scope will be the correct 'this'
                        // not the directive factory class
                        mapFieldsAndFunctionsIntoScope(scope, clazz.prototype, scope);
                        // duplicate $scope object in the scope, so it can be accessed in typescript as well, so you can be typesafe
                        scope.$scope = scope;
                        if (afterLinkingFn) {
                            afterLinkingFn.call(scope, scope, element, attrs);
                        }
                    };
                }
            }
            return Directive;
        })();
        base.Directive = Directive;
        /**
         * Maps fields and functions from an object into another object, with optional bind if it's defined. Useful for copying
         * class functionality into object.
         *
         * @param {Scope<>} scope the target scope where the object functions/fields will be copied
         * @param {Object} clazz prototype or object of the directive class
         * @param {Object} bindTo class to bind the functions
         */
        function mapFieldsAndFunctionsIntoScope(scope, clazz, bindTo) {
            for (var key in clazz) {
                if (clazz.hasOwnProperty(key)) {
                    if (typeof clazz[key] === 'function' && angular.isDefined(bindTo)) {
                        scope[key] = clazz[key].bind(bindTo);
                    }
                    else {
                        scope[key] = clazz[key];
                    }
                }
            }
        }
    })(base = kdarts.base || (kdarts.base = {}));
})(kdarts || (kdarts = {}));
//# sourceMappingURL=base.js.map