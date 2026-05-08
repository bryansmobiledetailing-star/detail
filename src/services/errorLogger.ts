import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: firebaseConfig.projectId,
  });
}

const db = getFirestore(firebaseConfig.firestoreDatabaseId);

export enum LogLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

export interface SystemLog {
  level: LogLevel;
  source: string;
  message: string;
  details?: any;
  timestamp: admin.firestore.Timestamp | Date;
  context?: {
    userId?: string;
    path?: string;
    method?: string;
    requestId?: string;
  };
}

export async function logToSystem(log: Omit<SystemLog, 'timestamp'>) {
  try {
    const logData = {
      ...log,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };

    console.log(`[${log.level.toUpperCase()}] [${log.source}] ${log.message}`);
    
    await db.collection('system_logs').add(logData);
  } catch (err) {
    console.error('CRITICAL: Failed to write to system_logs:', err);
  }
}

export async function logSquareError(source: string, message: string, error: any, context?: SystemLog['context']) {
  const details = {
    message: error.message,
    stack: error.stack,
    name: error.name,
    code: error.code,
    // Square specific error details if available
    errors: error.errors || []
  };

  await logToSystem({
    level: LogLevel.ERROR,
    source,
    message,
    details,
    context
  });
}
