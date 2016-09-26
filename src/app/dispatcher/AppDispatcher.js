import Flux from 'flux';

class AppDispatcher extends Flux.Dispatcher {}

module.exports = new AppDispatcher();