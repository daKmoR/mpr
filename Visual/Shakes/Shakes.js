/**
 * a Animation library
 *
 * @version		0.0.1
 *
 * @license		MIT-style license
 * @author		
 * @copyright Copyright belongs to the respective authors
 */

Fx.TweenDelta = new Class({
    Extends: Fx.Tween,
    prepare: function(element, property, delta){
        var values = [];
        values[0] = element.getStyle(property);
        var from = this.parse(values[0]);
//         if( from.parser != Fx.CSS.Parsers.Number ) return; //cant handle anything but numbers
        values[1] = from[0].value + Number(delta[0]);
        var parsed = values.map(this.parse);
        return {from: parsed[0], to: parsed[1]};
    },
    
});


var MultiAnimation = new Class({
    Implements: [Events, Options],
    options: {
        elementSearcher: $,
    },
    initialize: function(options) {
        this.setOptions(options);
        this.track = [];
        this.idx = 0;
        this.do_repeat = false;
        this.repeat_iterations = null;
        this.current_iteration = 0;
        this.__addEvents = true;
    },

    start: function() {
        if( this.idx < this.track.length ) {
            this.track[this.idx++].start();
        } else {
            if(this.do_repeat) {
                if( $chk(this.repeat_iterations) ) {
                    //bounded repeat
                    if( this.current_iteration < this.repeat_iterations - 1 ) {
                        this.current_iteration++;
                        this.idx = 0;
                        this.start.delay(0, this);
                    } else {
                        this.idx = 0;
                        this.current_iteration = 0;
                        this.fireEvent('onComplete');
                    }
                } else if($chk(this.check)) {
                    if( this.check()) {
                        this.current_iteration++;
                        this.idx = 0;
                        this.start.delay(0, this);
                    } else {
                        this.idx = 0;
                        this.current_iteration = 0;
                        this.fireEvent('onComplete');
                    }
                } else {
                    //unbounded repeat
                    this.idx = 0;
                    this.start.delay(0, this);
                }
            } else {
                this.idx = 0;
                this.current_iteration = 0;
                this.fireEvent('onComplete');
            }
        }
    },


    add: function(cog) {
        this.track.push(cog); cog.render();
        if(this.__addEvents) cog.addEvent('onComplete', this.start.bind(this));
        return this;
    },

    tween: function(element, property, value, options) {
        var cog = new Animation.Types.Tween(this, element, property, value, options, this.options);
        return this.add(cog);
    },

    tweendelta: function(element, property, value, options) {
        var cog = new Animation.Types.TweenDelta(this, element, property, value, options, this.options);
        return this.add(cog);
    },

    morph: function(element, values, options) {
        var cog = new Animation.Types.Morph(this, element, values, options, this.options);
        return this.add(cog);
    },

    delay: function(duration) {
        var cog = new Animation.Types.Delay(this, duration, this.options);
        return this.add(cog);
    },

    wait: function(producer, event) {
        var cog = new MultiAnimation.Types.Wait(this, producer, event, this.options);
        return this.add(cog);
    },

    parallel: function() {
        var cog = new MultiAnimation.Types.Parallel(this, this.options)
        this.add(cog);
        return cog;
    },

    serial: function() {
        var cog = new MultiAnimation.Types.Serial(this, this.options)
        this.add(cog);
        return cog;
    },

    render: function() { return this; },
    repeat: function(check) {
        this.do_repeat = true;
        if(ttype = $type(check)) {
            if( ttype == 'number' )
                this.repeat_iterations = check;
            else if( ttype == 'function')
                this.check = check;
        } else {
            this.repeat_iterations = null;
            this.check = null;
        }
        return this;
    }
});


MultiAnimation.Types = $H({});

MultiAnimation.Types.Wait = new Class({
    Implements: [Events, Options],
    initialize: function(parent, producer, event, animOptions) {
        this.setOptions(animOptions);
        this.parent_animation = parent;
        this.producer = producer;
        this.event = event;
        this.added = false;
    },
    
    render: function() {
        return this;
    },

    start: function() {
        var fe = this.fireEvent.bind(this, 'onComplete');
        var self = this;
        var rm = function() {
            self.producer.removeEvent(self.event, fe);
            self.producer.removeEvent(self.event, rm);
        }
        this.producer.addEvent(this.event, fe);
        this.producer.addEvent(this.event, rm);
    }
});

MultiAnimation.Types.Serial = new Class({
    Extends: MultiAnimation,
    initialize: function(parent, options) {
        this.parent(options);
        this.parent_animation = parent;
    },

    end: function() {
        return this.parent_animation;
    }
});


MultiAnimation.Types.Parallel = new Class({
    Extends: MultiAnimation,
    initialize: function(parent, options) {
        this.parent(options);
        this.parent_animation = parent;
        this.__addEvents = false;
    },

    start: function() {
        if( !$chk(this.group) ) {
            var self = this;
            this.group = new Group(this.track);
            this.group.addEvent('onComplete', function() {
                self.fireEvent('onComplete');
            });
        }

        this.track.each(function(item) {
            item.start();
        });
    },

    end: function() {
        return this.parent_animation;
    },
});

function animate() {
    return new MultiAnimation();
}





var Animation = new Class({
    Implements: Events,
    Extends: MultiAnimation,
    initialize: function(el, options) {
        this.element = $(el);
        this.parent(options);
    },

    tween: function(property, value, options) {
        return this.parent(this.element, property, value, options, this.options);
    },
    tweendelta: function(property, value, options) {
        return this.parent(this.element, property, value, options, this.options);
    },

    morph: function(values, options) {
        return this.parent(this.element, values, options, this.options);
    },

    delay: function(duration) {
        return this.parent(duration, this.options);
    },


    wait: function(producer, event) {
        return this.parent(producer, event, this.options);
    },

    parallel: function() {
        var cog = new Animation.Types.Parallel(this, this.element, this.options);
        this.add(cog);
        return cog;
    },

    serial: function() {
        var cog = new Animation.Types.Serial(this, this.element, this.options);
        this.add(cog);
        return cog;
    },

});

Animation.Types = $H({});

Animation.Types.Tween = new Class({
    Implements: [Events, Options],
    initialize: function(parent, el, property, value, tween_options, anim_options) {
        this.setOptions(anim_options);
        this.parent_animation = parent;
        this.css_property = property;
        this.value = value;
        this.tween_options = $extend({property: property}, tween_options||{});
        this.element = el;
    },

    render: function(callback, bind) {
        this.fx = new Fx.Tween(this.element, this.tween_options);

        var self = this;
        this.fx.addEvent('onComplete', function() {
            self.fireEvent('onComplete');
        });

        return this;
    },

    start: function() {
//         this.fx.element = this.fx.pass = this.options.elementSearcher(this.element);
        this.fx.start(this.value);
        return this;
    }
});

Animation.Types.TweenDelta = new Class({
    Implements: [Events, Options],
    initialize: function(parent, el, property, value, tween_options, anim_options) {
        this.setOptions(anim_options);
        this.parent_animation = parent;
        this.css_property = property;
        this.value = value;
        this.tween_options = $extend({property: property}, tween_options||{});
        this.element = el;
    },

    render: function() {
        this.fx = new Fx.TweenDelta(this.element, this.tween_options);

        var self = this;
        this.fx.addEvent('onComplete', function() {
            self.fireEvent('onComplete');
        });
        return this;
    },

    start: function() {
        this.fx.start(this.value);
        return this;
    }
});

Animation.Types.Morph = new Class({
    Implements: [Events, Options],
    initialize: function(parent, el, values, morph_options, anim_options) {
        this.setOptions(anim_options);
        this.parent_animation = parent;
        this.values = values;
        this.morph_options = morph_options;
        this.element = el;
    },

    render: function() {
        this.fx = new Fx.Morph(this.element, this.anim_options);

        var self = this;
        this.fx.addEvent('onComplete', function() {
            self.fireEvent('onComplete');
        });
        return this;
    },

    start: function() {
        this.fx.start(this.values);
        return this;
    }
});
    
Animation.Types.Delay = new Class({
    Implements: [Events, Options],
    initialize: function(parent, duration, anim_options) {
        this.setOptions(anim_options);
        this.parent_animation = parent;
        this.duration = duration;
    },

    render: function() {
        return this;
    },

    start: function() {
        this.fireEvent('onComplete', [], this.duration);
    }
});


Animation.Types.Parallel = new Class({
    Extends: Animation,
    initialize: function(parent, el, anim_options) {
        this.setOptions(anim_options);
        this.parent(el);
        this.parent_animation = parent;
        this.__addEvents = false;
    },

    start: function() {
        if( !$chk(this.group) ) {
            this.group = new Group(this.track);
            this.group.addEvent('onComplete', this.fireEvent.bind(this, 'onComplete'));
        }
        this.track.each(function(item) {
            item.start();
        });
    },

    end: function() {
        return this.parent_animation;
    }
});

Animation.Types.Serial = new Class({
    Extends: Animation,
    initialize: function(parent, el, anim_options) {
        this.setOptions(anim_options);
        this.parent(el);
        this.parent_animation = parent;
    },

    end: function() {
        return this.parent_animation;
    }
});

Element.implement({
    animate: function(options) {
        return new Animation(this, options);
    }
});