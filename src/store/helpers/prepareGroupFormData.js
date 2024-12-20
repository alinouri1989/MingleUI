export const prepareGroupFormData = (formData) => {
    const form = new FormData();
  
    // "Name" ekleniyor
    form.append('Name', formData.name);
  
    // "Description" (opsiyonel) ekleniyor
    if (formData.description) {
      form.append('Description', formData.description);
    }
  
    // "Photo" (opsiyonel) ekleniyor
    if (formData.photo) {
      form.append('Photo', formData.photo);
    }
  
    // "Participants" (opsiyonel) ekleniyor
    if (formData.participants) {
      const formattedParticipants = {};
      Object.entries(formData.participants).forEach(([userId, user]) => {
        formattedParticipants[userId] = Number(user.Role);
      });
  
      form.append('Participants', JSON.stringify(formattedParticipants));
    }
  
    return form;
  };