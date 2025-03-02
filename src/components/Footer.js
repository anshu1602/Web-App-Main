import React from "react";

function Footer() {
  return (
    <>
      <div id="footer" className="clearfix sidebar-page right-sidebar-page">
        <p className="pull-left">
          Copyrights &copy; 2014{" "}
          <a
            href="http://suggeelson.com/"
            className="color-blue strong"
            target="_blank"
            rel="noreferrer"
          >
            SuggeElson
          </a>
          . All rights reserved.
        </p>
        <p className="pull-right">
          <a href="#" className="mr5">
            Terms of use
          </a>
          |
          <a href="#" className="ml5 mr25">
            Privacy police
          </a>
        </p>
      </div>

      <div id="back-to-top">
        <a href="#">Back to Top</a>
      </div>
    </>
  );
}

export default Footer;