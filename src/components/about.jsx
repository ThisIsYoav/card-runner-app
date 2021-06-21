import React from "react";
import PageHeader from "./common/pageHeader";

const About = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <PageHeader titleText="About CardRunner" />
          <p>Cardrunner is a study project for searching and managing your business cards.</p>
           <hr />
          <p>With card runner you can:</p>
          <h4>
            Free User
          </h4>
          <ul>
            <li>Browse for cards, fast and free.</li>
            <li>Use our live search - see the results as you type (on browse page).</li>
            <li>Add cards to your personal favorites, view them at any time.</li>
          </ul>
          <h4>
            Free Business User
          </h4>
          <ul>
            <li>Everything a free user enjoys, plus:</li>
            <li>Create, edit or delete your own business cards.</li>
            <li>View all of your cards in one place.</li>
            <li>Liked by many? your card might reach our front page.</li>
          </ul>
          <hr/>
          <span className='font-weight-light'>
            CardRunner is a student project made with love by Yoav BS.
            <br />
            For support: <a href="mailto:yoavsbs254@gmail.com">Yoav</a>
          </span>
        </div>
      </div>
    </div>
  );
}
 
export default About;