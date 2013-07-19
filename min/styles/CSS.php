<?php
        $unique = "#".$_GET['id'];
?>

        <? echo $unique; ?> .arkanvas, <? echo $unique; ?>.arkanvas{
                position: absolute;
                top: 0px;
                left: 0px;
                padding: 0px;
                margin: 0px;
                border: 0px;
                height: 100%;
                width: 100%;
        }

        <? echo $unique; ?> .controlls{
                position: absolute;
                top: 0px;
                left: 0px;
                padding: 0px;
                margin: 0px;
                border: 0px;
                height: 50%;
                width: 100%;
                opacity: 0.0;
        }

        <? echo $unique; ?> .controlls:hover{
                opacity: 1.0;
        }

        <? echo $unique; ?> .controlls ul{
                margin-left: auto;
                margin-right: auto;
                display: block;
                height: 200px;
                width: 450px;
                padding: 0px;
        }

        <? echo $unique; ?> .controlls ul li{
                display: inline-block;
                vertical-align: top;
                height: 100px;
                width: 100px;
                margin: 0px;
                padding: 0px;
                border: none;
                background-color: rgba(0,0,0, 0.5);
                cursor: pointer;
        }

        <? echo $unique; ?> .controlls div{
                position: absolute;
                bottom: 10px;

                padding: 0px;
                margin: 0px;
                border-width: 0px;

                height: 100px;
                width: 100px;
                cursor: pointer;
        }

        <? echo $unique; ?> .controlls .gallery_loader{
                bottom: auto;
                top: 10px;
                left: 10px;
                background-color: transparent;
        }

        <? echo $unique; ?> .controlls .gallery_prev{
                left: 10px;
                background-color: rgba(255,255,255, 0.5);
        }

        <? echo $unique; ?> .controlls .gallery_next{
                right: 10px; 
                background-color: rgba(255,255,255, 0.5);
        }

        <? echo $unique; ?> .controlls canvas{
                width: 100%;
                height: 100%;
                padding: 0px;
                margin: 0px;
        }
