type TouchEventCallback = (e: TouchEvent) => void;
type WheelEventCallback = (e: WheelEvent) => void;

interface ElemEvents {
    on_touchstart: TouchEventCallback;
    on_touchmove: TouchEventCallback;
    on_wheel: WheelEventCallback;
}

//  ---------------------------------------------------------------------------------------------------------------  //

const ATTR_NAME = 'data-scroll-id';

const events: {
    [key: string]: ElemEvents;
} = {};

//  ---------------------------------------------------------------------------------------------------------------  //

export function blockScroll(elem: HTMLElement) {
    let id = elem.getAttribute(ATTR_NAME);
    
    if (id) {
        return;
    }
    id = 'scroll-id-' + Date.now();
    elem.setAttribute(ATTR_NAME, id);

    let _client_y: number;

    const elem_events = {
        on_touchstart: function (e: TouchEvent) {
            if (e.targetTouches.length === 1) {
                _client_y = e.targetTouches[0].clientY;
            }
        },

        on_touchmove: function (e: TouchEvent) {
            if (e.targetTouches.length !== 1) {
                return;
            }

            const client_y = e.targetTouches[0].clientY - _client_y;
            if (elem.scrollTop === 0 && client_y > 0) {
                e.preventDefault();
            }
            if ((elem.scrollHeight - elem.scrollTop <= elem.clientHeight) && client_y < 0) {
                e.preventDefault();
            }
        },

        on_wheel: function (e: WheelEvent) {
            const delta = e.deltaY || e.detail;

            if (
                (delta < 0 && (elem.scrollTop === 0)) ||
                (delta > 0 && (elem.scrollHeight - elem.clientHeight - elem.scrollTop <= 1))
            ) {
                e.preventDefault();
            }
        },
    };

    elem.addEventListener('touchstart', elem_events.on_touchstart);
    elem.addEventListener('touchmove', elem_events.on_touchmove);
    elem.addEventListener('wheel', elem_events.on_wheel);

    events[id] = elem_events;
}

//  ---------------------------------------------------------------------------------------------------------------  //

export function unblockScroll(elem: HTMLElement) {
    const id = elem.getAttribute(ATTR_NAME);
    if (!id) {
        return;
    }

    elem.removeAttribute(ATTR_NAME);

    const elem_events = events[id];

    if (elem_events) {
        elem.removeEventListener('touchstart', elem_events.on_touchstart);
        elem.removeEventListener('touchmove', elem_events.on_touchmove);
        elem.removeEventListener('wheel', elem_events.on_wheel);
    }

    delete events[id];
}
