import { Settings } from '@newmbani/types';
import { logo } from '../../../common/constants/constants';
import { appName } from '@newmbani/shared';

export const mailHeaderTemplate = (
  data: { title: string },
  settings: Settings,
) => {
  const template = `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${data.title}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Varela+Round&display=swap');
        body {
            font-family: "Varela Round", sans-serif;
            background: white;
            color: #333;
            line-height: 1.4;
        }
    </style>
  </head>
  <body style="padding: 0; margin: 0; box-sizing: border-box; ">
  
    <main
      style="
        font-family: "Trip Sans", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
          Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
          sans-serif;
        font-weight: 400;
        line-height: normal;
      "
    >
      <div
        class="header"
        style="
          height: max-content;
          background-color: #fff;
          padding: 10px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        "
      >
        <div
          class="left"
          style="
            display: flex;
            align-items: center;
            justify-content: flex-start;
          "
          height="120px"
        >
          <img src="${
            settings.branding.logo ? settings.branding.logo : `${logo}`
          }" alt="${appName} Logo" style="width: 120px; object-fit: contain;" />
        </div>
      </div>
      <div
        class="body"
        style="padding: 10px 20px; background-color: #fff;"
      >
    `;

  return template;
};
