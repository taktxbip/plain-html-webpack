'strict';
import '@fancyapps/fancybox/dist/jquery.fancybox.min.css';
import 'simplebar/dist/simplebar.min.css';
import './scss/main.scss';

import $ from 'jquery';
import SimpleBar from 'simplebar';
import { openPopup } from './js/utils';

$(document).ready(function () {
    // openPopup('.open-popup');

    $('.simplebar-scroll').each(function () {
        const current = $(this).get(0);
        new SimpleBar(current, {
            autoHide: false,
            classNames: {
                // defaults
                content: 'simplebar-content',
                scrollContent: 'simplebar-scroll-content',
                scrollbar: 'simplebar-scrollbar',
                track: 'simplebar-track'
            }
        });
    });
});