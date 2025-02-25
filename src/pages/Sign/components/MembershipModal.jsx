import CloseModalButton from '../../../contexts/components/CloseModalButton';
import { useModal } from '../../../contexts/ModalContext';

function MembershipModal() {

    const { closeModal } = useModal();

    return (
        <div className='membership-agreement-box'>
            <CloseModalButton closeModal={closeModal} />
            <h1>Üyelik Sözleşmesi</h1>
            <div className='membership-terms-box'>
                <h4>1. Sözleşmenin Amacı</h4>
                <p><strong>1.1.</strong> Bu Sözleşme, Mingle adlı gerçek zamanlı sohbet uygulamasının kullanım şartlarını ve Üye'nin hak ve yükümlülüklerini belirlemek amacıyla düzenlenmiştir.</p>
                <p><strong>1.2.</strong> Mingle, herhangi bir ticari amaç gütmemekte olup, yalnızca Bilgisayar Ağları dersi kapsamında hazırlanmış bir eğitim ve ders projesidir. Uygulama, gerçek bir sohbet platformunu simüle etmek amacıyla tasarlanmıştır.</p>

                <h4>2. Üyelik Koşulları</h4>
                <p><strong>2.1.</strong> Üyelik başvurusunda bulunarak, Üye bu Sözleşme'yi okuduğunu, anladığını ve tüm şartlarını kabul ettiğini beyan eder.</p>
                <p><strong>2.2.</strong> Üyelik başvurusu, Üye'nin gerekli bilgileri eksiksiz ve doğru bir şekilde doldurması ve Proje Sahibi'nin onayı ile tamamlanır. Proje Sahibi, üyelik başvurularını kabul etmeme hakkını saklı tutar.</p>

                <h4>4. Kullanım Şartları ve Sınırlamaları</h4>
                <p><strong>4.1.</strong> Üye, Mingle uygulamasını yalnızca kişisel kullanım amacıyla kullanacağını kabul eder. Uygulama üzerindeki tüm işlemler (mesaj gönderme, sohbet odası oluşturma vb.) tamamen simülasyon amaçlı olup, gerçek bir ticari işlem niteliği taşımamaktadır.</p>
                <p><strong>4.2.</strong> Üye, uygulama üzerindeki tüm içeriklerin ve işlemlerin gerçek olmadığını, sadece eğitim ve proje geliştirme amacıyla sunulduğunu kabul eder.</p>

                <h4>4. Gizlilik</h4>
                <p><strong>4.1.</strong> Proje Sahibi, Üye'nin kişisel verilerini hiçbir üçüncü taraf ile paylaşmayacağını taahhüt eder.</p>
                <p><strong>4.2.</strong> Üye, uygulamaya erişim için kullandığı şifre ve kullanıcı adı gibi bilgilerin güvenliğinden sorumludur. Üye, bu bilgilerin yetkisiz kişilerce kullanılmasından dolayı doğabilecek zararlardan kendisi sorumludur.</p>

                <h4>5. Verilerin Kullanımı ve Güvenliği</h4>
                <p><strong>5.1.</strong> Üye tarafından sağlanan tüm bilgiler, sadece simülasyon amacıyla kullanılacak ve hiçbir ticari veya üçüncü taraf amaçla işlenmeyecektir.</p>
                <p><strong>5.2.</strong> Üye'nin uygulama üzerindeki tüm işlemleri (mesaj gönderme, sohbet odası oluşturma vb.) gerçek bir ticari işlem gibi işlemeyecek, sadece simülasyon kapsamında değerlendirilecektir.</p>

                <h4>6. Sorumluluk Reddi</h4>
                <p><strong>6.1.</strong> Proje Sahibi, uygulama üzerindeki içeriklerin ve işlemlerin gerçeklik taşımadığını, sadece eğitim ve geliştirme amaçlı olduğunu beyan eder. Üye, bu durumu kabul eder ve uygulamayı bu bilinçle kullanır.</p>
                <p><strong>6.2.</strong> Üye, uygulama kullanımı sırasında doğabilecek herhangi bir zarardan Proje Sahibi'ni sorumlu tutmayacağını kabul eder.</p>
            </div>
        </div>
    );
}

export default MembershipModal