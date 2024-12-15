const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

// Initialize Firebase Admin with direct values
const app = initializeApp({
  credential: cert({
    projectId: 'hirely-2c235',
    clientEmail: 'firebase-adminsdk-xexoc@hirely-2c235.iam.gserviceaccount.com',
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCvhViVINKa40fk\nixHKfZ6vYyRDtsz1tXYYON78Yp7WVybPROySqhONlDdpiM3xAp3PC8YMeYnAf1U7\ndcf2iXAuEoEzhd/kVve8qLF0bgN1pZ1aNbBXEOXX7hiQSD6uyk9WQ7JluJ6u6vFb\n8ezzRgdIaD5R/SoGj+3DM9kFVe2qhEuKmsDIdtiOqB/XcFUmyiO8dA4GznyRa9aI\nVs7HlPyJimfyw4eDi/mfvuVe2sz63ZQ+nSqGVrubQReAD6ag4tFV3kStdPle1vkq\nHU0P/6poJ5sOVFqAxxIC5jhgFA7qjCDZxh5eZLcxQNHPawJmgRGut74FdxwJwCwC\ns6oUbwqPAgMBAAECggEAAYhVXgpgfoTbleBfyKCKgKpnpPTqfQckKCJR7B4H7XuE\nl8ylf8MBJBopb/eP7hv2o6aq92T8JQe1dk9IEJfZWpr20xq16Q1T4QkPpGa2LVrU\nrLrvvxFFZ22g0VhcaNHUiMb9z61/gCNKbTdUhgWHeozOMn+Jw00bBVQUVTDk2ahj\nnLqckC0ZDsgzYZE5le+8UUmgcyo1QYH3O+hEtcxOPT2Msu7eokY3ZJk7T8ukpXJ9\nYGkmfxAYzK3oZyhxjdpJBODbo/vYb9xU+ztMW2IJBgk8GLETHQeFFC+bS6W7QNBo\n0jIMjyghP4h1/OTSPIzXubz3v4D/E658mVCdAuAdIQKBgQDl/un/80R2BJfQTtDv\noeuCZm4J5G7kjhaTrrOkPAUrd9EOpqshKJ1dIB+HDXBatnZ2P203wtkEMBZoYgrY\nFf7jU3JtWR2g3KdFnzdSaSlspbvz0b45jn9QsoSyvjoe4o+NTUpwwZKBzGJAO3ao\n6ISUiLCV75AIF6IemAtSgze0bwKBgQDDXbCupS5+F2Q9JWxQIxhJdlGXChXMXPnv\nLJf1j84DpWu2ZxX0PcVZQIwY2/EWBhkOLLPcD6bB0rrGYYGO1reEvqPbuY60uUGu\nhLvXiqQiBTtDW2Df3f/jkKUJ1fFk+6+Np/rbG4VsOnRl/pp5atVPZCQMRZZZ5Psi\n7zU1CQpb4QKBgQDY5ELxfwyhqwUriRgZ032PtF6y73vwB1qdHJQGHh/V9SDuCxi4\npV95EbEJoA/DS+x86KVrf1E+VMbc2xBU5LFA2VHActiw+US5MENwcQGCluyfKr2T\n86B2jlL7aM7Qj2FGpIu9t54cz4wb/LeS4+sbU6gLTSZrqzXUWhfbUSj3+wKBgHVI\n2bj/EVpBULwkq1Gwv/PaREEYnN2DM8iSTOfu3Q7zUCbA3D00mDVsuq5x29oM7x3D\nWHbULphNmjNedhj6blIS4OwYCcQVM4lBxkMvyDlkSp+1TAMZk3VacLnm5nRpZIr2\nPXMsonzG2vogTzx1FnoC9GEppYlyHhJq6NZeBwoBAoGBAIVfLVIzVN5QVkBLuCh/\nY128M5FJJgchAuUZjqxP4fx5xOfjAOJBEosly392+yPbkZ0ou7g1Uc3/t9LKv4IF\nVsT1xQ7reCc6y4TPaouX1f+vrZSTIc0Pg8Flp34UUwqSOj/r5nY3s0UN35qP8ov9\nV8aYEsh2ofcItzVdZU0cnzFN\n-----END PRIVATE KEY-----\n"
  })
});

async function getCustomToken() {
  try {
    const auth = getAuth(app);
    
    // Create a custom token for testing
    const uid = 'test-user-123'; // You can use any unique identifier
    const customToken = await auth.createCustomToken(uid);
    
    console.log('Your Firebase custom token:', customToken);
    return customToken;
  } catch (error) {
    console.error('Error getting token:', error);
    throw error;
  }
}

getCustomToken();
