define('app/controllers/key_add', [
    'ember'
    ],
    /**
     * Key Add Controller
     *
     * @returns Class
     */
    function() {
        return Ember.Object.extend({

            newKeyName: null,
            newKeyReady: null,
            newKeyPrivate: null,

            init: function() {
                this._super();
            },

            newKeyObserver: function() {
                if (this.newKeyName && this.newKeyPrivate) {
                    this.set('newKeyReady', true);
                    $('#create-key-ok').removeClass('ui-disabled');
                } else {
                    this.set('newKeyReady', false);
                    $('#create-key-ok').addClass('ui-disabled');
                }
            }.observes('newKeyName', 'newKeyPrivate'),

            newKey: function(machine) {
                Mist.keysController.newKey(this.get('newKeyName').trim(),
                                           this.get('newKeyPrivate').trim(), machine);
            },

            newKeyClear: function() {
                this.set('newKeyName', null);
                this.set('newKeyPrivate', null);
            },

            generateKey: function() {
                $('#create-key-dialog .ajax-loader').fadeIn(200);
                $.ajax({
                    url: '/keys',
                    type: 'POST',
                    success: function(data) {
                        info('Successfully generated key');
                        $('#create-key-dialog .ajax-loader').fadeOut(200);
                        Mist.keyAddController.set('newKeyPrivate', data.priv);
                    },
                    error: function(jqXHR, textstate, errorThrown) {
                        Mist.notificationController.notify('Error while generating key: ' + jqXHR.responseText);
                        error(textstate, errorThrown, ', while generating key. ', jqXHR.responseText);
                        $('#create-key-dialog .ajax-loader').fadeOut(200);
                    }
                });
            }
        });
    }
);
