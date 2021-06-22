export class WebResource {
  constructor({ docId, name, title, description, url, tags, postedBy, image, logo, createdAt, lastUpdatedAt }) {
    this.docId = docId;
    this.name = name;
    this.title = title;
    this.description = description;
    this.url = url;
    this.tags = tags;
    this.postedBy = postedBy;
    this.image = image;
    this.logo = logo;
    this.createdAt = createdAt || new Date().toDateString();
    this.lastUpdatedAt = lastUpdatedAt || new Date().toDateString();
  }
}

// Firestore data converter
export const webResourceConverter = {
  toFirestore: function (resource) {
    return {
      ...resource,
    };
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options);
    return new WebResource({ ...data });
  },
};
