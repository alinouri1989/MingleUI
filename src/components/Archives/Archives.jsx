
import { useParams } from "react-router-dom";

import WelcomeScreen from "../WelcomeScreen/WelcomeScreen";
import "../layout.scss";


function Archives() {
  const { id } = useParams();
  return (
    <>
      <div className='archive-general-box'>
        {!id && <WelcomeScreen text={"Kişisel arşivleriniz uçtan uca şifrelidir"} />}
      </div>
    </>

  )
}

export default Archives;