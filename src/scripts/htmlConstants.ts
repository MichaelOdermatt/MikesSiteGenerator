export const TEMPLATE_BODY_KEY = '{% block content %}';
export const TEMPLATE_TITLE_KEY = '{{ title }}';
export const TEMPLATE_STYLESHEET_KEY = '{{ stylesheets }}'
export const TEMPLATE_SCRIPT_KEY = '{{ scripts }}'
export const TEMPLATE_FILENAME_KEY = '{{ fileName }}'
export const STYLESHEET_ELEMENT_TEMPLATE = '<link rel="stylesheet" href="css/{{ fileName }}.css">'
export const SCRIPT_ELEMENT_TEMPLATE = '<script src="scripts/{{ fileName }}.js"></script>'