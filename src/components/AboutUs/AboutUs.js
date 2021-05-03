import React from "react";
import "./AboutUs.css";
import SharanImg from "../../assets/images/Sharan.JPG";
import RoshanImg from "../../assets/images/Roshan.jpg";
import SunilImg from "../../assets/images/Sunil.jpg";

const AboutUs = () => {
  return (
    <div className="AboutUs">
      <div className="row">
        <div className="col card">
          <img src={RoshanImg} />
          <h5>
            <b>Shaik Roshan Nabi</b>
          </h5>
          <h5>
            <b>Quality Assurance Tester</b>
          </h5>
          <a href="https://www.facebook.com/roshan.nabi.3" target="_blank">
            Facebook Profile
          </a>
        </div>
        <div className="col card">
          <img src={SharanImg} />
          <h5>
            <b>Konda Sharan Sai Reddy</b>
          </h5>
          <h5>
            <b>Lead Developer</b>
          </h5>
          <a
            href="https://www.linkedin.com/in/sharan-konda-90b3a6193/"
            target="_blank"
          >
            Linkedin Profile
          </a>
        </div>
        <div className="col card">
          <img src={SunilImg} />
          <h5>
            <b>Sunil Kumar</b>
          </h5>
          <h5>
            <b>Database Architect</b>
          </h5>
          <a href="https://www.facebook.com/sunil.jngp/" target="_blank">
            Facebook Profile
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
