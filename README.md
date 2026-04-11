# HUE.ai
HUE.ai - an application to style(CSS) webpages in html, ejs, jsx files through AI.

This tool is designed to assist developers in quickly generating CSS styles for their web projects. By leveraging AI, HUE.ai can analyze the structure of your HTML, EJS, or JSX files and provide tailored CSS suggestions to enhance the visual appeal of your web pages.

Hosted on: 


Team and Roles


Concept - Renjeesh

Project management - Jerin


flowchart LR

%% ========================
%% Frontend (React)
%% ========================
subgraph FE["Frontend (React)"]

    L[Landing Page<br/>- About Us<br/>- Start Button]

    I[Input مرحلة<br/>- Layout / Color / Font<br/>- First Prompt]

    P[Preview & Adjust<br/>- Display Preview<br/>- Adjust Prompt<br/>- Re-render]

    O[Output<br/>- Download CSS<br/>- Reset / Repeat]

end

%% ========================
%% Backend (Express)
%% ========================
subgraph BE["Backend (Express API)"]

    W["GET /wake<br/>Health Check"]

    INIT["POST /initial<br/>Body: prompt + html"]

    ADJ["POST /adjust<br/>Body: adjust prompt + html"]

    FILE["POST /file<br/>Convert internal → external CSS"]

    REP["POST /repeat<br/>Body: html1 + html2 + prompt"]

end

%% ========================
%% AI Service
%% ========================
subgraph AI["AI Service"]

    G["Google Gemini<br/>Input: Prompt + HTML<br/>Output: CSS"]

end

%% ========================
%% Flow Connections
%% ========================

L --> W --> INIT
INIT --> G --> P

P --> ADJ --> G --> P

P --> FILE --> O

O --> REP --> G --> P
Front end (React)
    Archana, Devika, Ijas, Karthika, Noufa, Shino, Vivek

Front end (CSS)
    Afsel, Sahad

Back end (Express)
    Ananda, Alfin, Gopika
