import { useSelector } from "react-redux";
import SearchInput from "./SearchInput";
import "./style.scss";
import UserCallCard from "./UserCallCard";
import { getUserIdFromToken } from "../../../helpers/getUserIdFromToken";

function CallsList() {
  const { token } = useSelector(state => state.auth);
  const { callRecipientList, calls } = useSelector(state => state.call);
  const userId = getUserIdFromToken(token);

  // Calls listesi işleniyor
  const processedCalls = calls.map(call => {
    // Diğer katılımcının ID'sini bul
    const otherParticipantId = call.participants.find(participant => participant !== userId);

    // CallRecipientList'ten bu ID'ye ait bilgileri al
    const recipientInfo = callRecipientList.find(recipient => recipient.id === otherParticipantId);

    // Outgoing call'ı kontrol et
    const isOutgoingCall = call.participants[0] === userId;

    // Birleştirilmiş veri oluştur
    return {
      id: call.id, // Call ID
      name: recipientInfo?.displayName || "Unknown", // Kullanıcı adı
      image: recipientInfo?.profilePhoto || "", // Profil fotoğrafı
      status: recipientInfo?.lastConnectionDate || "offline", // Kullanıcı durumu
      callStatus: call.status, // Çağrı durumu
      callType: call.type, // Çağrı türü
      callDuration: call.callDuration, // Çağrı süresi
      createdDate: new Date(call.createdDate), // Çağrı tarihi, Date objesi olarak
      isOutgoingCall // Çağrı çıkış durumu
    };
  });

  // Call'ları createdDate'e göre azalan sırayla sıralıyoruz (yani en güncel tarihten en eskiye)
  const sortedCalls = processedCalls.sort((a, b) => b.createdDate - a.createdDate);

  return (
    <div className="call-list-box">
      <SearchInput placeholder={"Aratın veya yeni arama başlatın"} />
      <div className="user-list">
        {sortedCalls.map(callInfo => (
          <UserCallCard
            key={callInfo.id}
            callId={callInfo.id}
            image={callInfo.image}
            status={callInfo.status}
            callType={callInfo.callType}
            name={callInfo.name}
            callStatus={callInfo.callStatus}
            createdDate={callInfo.createdDate}
            isOutgoingCall={callInfo.isOutgoingCall}
          />
        ))}
      </div>
    </div>
  );
}

export default CallsList;
