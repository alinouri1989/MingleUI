export const prepareGroupFormData = (formData, isEdit) => {
  const form = new FormData();

  // "Name" ekleniyor
  form.append('Name', formData.name);

  // "Description" (opsiyonel) ekleniyor
  if (formData.description) {
    form.append('Description', formData.description);
  }


  if (isEdit) {
    // Dosya geldiğinde, photoUrl null olarak ayarlanır
    if (formData.photoUrl && typeof formData.photoUrl === 'string' && formData.photoUrl.startsWith("https")) {
      form.append("PhotoUrl", formData.photoUrl);
    }

    else {
      form.append('Photo', formData.photoUrl);
    }
    if (formData.photoUrl == null) {
      form.append('PhotoUrl', "");
    }

  } else {
    form.append('Photo', formData.photo);
  }



  if (formData.participants) {
    const formattedParticipants = {};
    Object.entries(formData.participants).forEach(([userId, user]) => {
      formattedParticipants[userId] = Number(user.role);
    });
    form.append('Participants', JSON.stringify(formattedParticipants));
  }

  return form;
};
