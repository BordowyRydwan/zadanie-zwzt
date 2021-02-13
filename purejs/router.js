// JavaScript router in 20 lines
// Joakim Carlstein - https://joakim.beng.se/
import { engine } from './engine';
let el = null;
let events = [];
const routes = {};

export const route = (path, templateId, controller) => {
  const listeners = [];
  controller.prototype.$on = (selector, evt, handler) => events.push([selector, evt, handler]);
  controller.prototype.$refresh = () => listeners.forEach(fn => fn());
  routes[path] = {
    templateId: templateId,
    controller: controller,
    onRefresh: listeners.push.bind(listeners)
  };
};

const forEachEvent = fnName => {
  for (let i = 0; i < events.length; i++) {
    const els = el.querySelectorAll(events[i][0]);
    for (let j = 0; j < els.length; j++) {
      els[j][fnName].apply(els[j], events[i].slice(1));
    }
  }
};

const router = async () => {
  // Lazy load view element:
  el = el || document.getElementById('app');
  // Remove current event listeners:
  forEachEvent('removeEventListener');
  // Clear events, to prepare for next render:
  events = [];
  // Current route url (getting rid of '#' in hash as well):
  const url = location.hash.slice(1) || '/';
  // Get route by url or fallback if it does not exist:
  const route = routes[url] || routes['*'];

  let templatePath = location.hash.slice(1) || '/login';
  
  if(!routes.hasOwnProperty(url)){
    templatePath = '/404';
  }

  const file = await fetch(`./views${templatePath}.purejs`)
                      .then(response => response.text());
                    
  const parser = new DOMParser();
  const component = parser.parseFromString(file, 'text/html');

  const previousStyles = document.head.querySelector('style');

  if(previousStyles !== null){
    document.head.removeChild(previousStyles);
  }

  const componentCode = component.querySelector('script');
  const componentStyle = component.querySelector('style');
                      
  document.head.appendChild(componentCode);

  if(componentStyle !== null){
    document.head.appendChild(componentStyle);
  }

  if (route && route.controller) {
    const ctrl = new route.controller();
    // Listen on route refreshes:
    route.onRefresh(() => {
      forEachEvent('removeEventListener');
      // Render route template with John Resig's template engine:
      el.innerHTML = engine(route.templateId, ctrl);
      forEachEvent('addEventListener');
    });
    // Trigger the first refresh:
    ctrl.$refresh();
  }

  document.head.removeChild(componentCode);
};

window.addEventListener('hashchange', router);
window.addEventListener('load', router);