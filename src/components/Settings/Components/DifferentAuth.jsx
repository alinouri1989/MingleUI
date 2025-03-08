import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

function DifferentAuth(providerId) {
    return (
        <div className="different-auth">
            <h3>Şifreni Değiştir</h3>
            <div className="different-auth-box">
                {providerId == "google.com" ? <FcGoogle /> : <FaFacebook />}
                <p>{providerId == "google.com" ? "Google" : "Facebook"} ile giriş yaptınız</p>
                <span>Şifrenizi {providerId == "google.com" ? "Google" : "Facebook"} hesabınızdan değiştirebilirsin</span>
            </div>
        </div>

    )
}

export default DifferentAuth