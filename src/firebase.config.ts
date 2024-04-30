import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

function configFirebaseAdmin(configService: ConfigService) {
  const adminConfig: admin.ServiceAccount = {
    projectId: configService.get('FIREBASE_PROJECT_ID'),
    privateKey: configService.get('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),
    clientEmail: configService.get('FIREBASE_CLIENT_EMAIL'),
  };
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(adminConfig),
    });
  }
}

export { configFirebaseAdmin };

