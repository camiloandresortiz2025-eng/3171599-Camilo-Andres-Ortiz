console.log('💸 SISTEMA DE REMESAS INTERNACIONALES\n');

type Currency = 'USD' | 'MXN' | 'GTQ' | 'HNL' | 'EUR' | 'COP' | 'PEN';

type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

type DeliveryMethod = 'bank_transfer' | 'cash_pickup' | 'mobile_wallet' | 'home_delivery';

type IdentificationType = 'passport' | 'national_id' | 'drivers_license' | 'tax_id';

interface Person {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  identificationType: IdentificationType;
  identificationNumber: string;
}

interface Sender extends Person {
  registrationDate: Date;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  monthlyTransferLimit: number;
  totalSentThisMonth: number;
}

interface Recipient extends Person {
  preferredDeliveryMethod: DeliveryMethod;
  bankAccountNumber?: string;
  bankName?: string;
  mobileWalletId?: string;
}

interface Remittance {
  id: string;
  senderId: string;
  recipientId: string;
  amountSent: number;
  currencySent: Currency;
  amountReceived: number;
  currencyReceived: Currency;
  exchangeRate: number;
  fee: number;
  totalCost: number;
  deliveryMethod: DeliveryMethod;
  status: TransactionStatus;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  referenceCode: string;
}

interface ExchangeRate {
  fromCurrency: Currency;
  toCurrency: Currency;
  rate: number;
  lastUpdated: Date;
}

function generateId(): string {
  return `REM-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

function generateReferenceCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

function createSender(
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  country: string,
  identificationType: IdentificationType,
  identificationNumber: string,
  monthlyLimit: number = 10000
): Sender {
  return {
    id: generateId(),
    firstName,
    lastName,
    email,
    phone,
    country,
    identificationType,
    identificationNumber,
    registrationDate: new Date(),
    verificationStatus: 'pending',
    monthlyTransferLimit: monthlyLimit,
    totalSentThisMonth: 0
  };
}

function createRecipient(
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  country: string,
  identificationType: IdentificationType,
  identificationNumber: string,
  preferredDeliveryMethod: DeliveryMethod,
  bankDetails?: { accountNumber: string; bankName: string },
  mobileWalletId?: string
): Recipient {
  return {
    id: generateId(),
    firstName,
    lastName,
    email,
    phone,
    country,
    identificationType,
    identificationNumber,
    preferredDeliveryMethod,
    bankAccountNumber: bankDetails?.accountNumber,
    bankName: bankDetails?.bankName,
    mobileWalletId
  };
}

function calculateFee(amount: number, deliveryMethod: DeliveryMethod): number {
  let fee = amount * 0.02;
  
  switch (deliveryMethod) {
    case 'cash_pickup':
      fee += 3.00;
      break;
    case 'home_delivery':
      fee += 8.00;
      break;
    case 'bank_transfer':
      fee += 1.50;
      break;
    case 'mobile_wallet':
      fee += 0.50;
      break;
  }
  
  return Math.min(Math.max(fee, 4.99), 50);
}

function createRemittance(
  senderId: string,
  recipientId: string,
  amountSent: number,
  currencySent: Currency,
  currencyReceived: Currency,
  exchangeRate: number,
  deliveryMethod: DeliveryMethod
): Remittance {
  const fee = calculateFee(amountSent, deliveryMethod);
  const amountReceived = amountSent * exchangeRate;
  
  return {
    id: generateId(),
    senderId,
    recipientId,
    amountSent,
    currencySent,
    amountReceived: Math.round(amountReceived * 100) / 100,
    currencyReceived,
    exchangeRate,
    fee,
    totalCost: amountSent + fee,
    deliveryMethod,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
    referenceCode: generateReferenceCode()
  };
}

function updateRemittanceStatus(
  remittance: Remittance,
  newStatus: TransactionStatus
): Remittance {
  const updated = {
    ...remittance,
    status: newStatus,
    updatedAt: new Date()
  };
  
  if (newStatus === 'completed') {
    updated.completedAt = new Date();
  }
  
  return updated;
}

function listRemittances(remittances: Remittance[]): Remittance[] {
  return remittances;
}

function filterByStatus(
  remittances: Remittance[],
  status: TransactionStatus
): Remittance[] {
  return remittances.filter(r => r.status === status);
}

function filterByDeliveryMethod(
  remittances: Remittance[],
  method: DeliveryMethod
): Remittance[] {
  return remittances.filter(r => r.deliveryMethod === method);
}

function findByReferenceCode(
  remittances: Remittance[],
  code: string
): Remittance | undefined {
  return remittances.find(r => r.referenceCode === code);
}

function calculateTotalSentBySender(
  remittances: Remittance[],
  senderId: string
): number {
  return remittances
    .filter(r => r.senderId === senderId && r.status !== 'cancelled' && r.status !== 'failed')
    .reduce((total, r) => total + r.amountSent, 0);
}

console.log('📝 Creando remitente de prueba...');
const sender1 = createSender(
  'Carlos',
  'Martínez',
  'carlos.martinez@email.com',
  '+1-555-123-4567',
  'USA',
  'passport',
  'US123456789',
  15000
);
console.log('✅ Remitente creado:', sender1.firstName, sender1.lastName);
console.log('   ID:', sender1.id);
console.log('   Estado verificación:', sender1.verificationStatus);
console.log('   Límite mensual: $' + sender1.monthlyTransferLimit);

console.log('\n📝 Creando beneficiarios...');
const recipient1 = createRecipient(
  'María',
  'González',
  'maria.gonzalez@email.com',
  '+52-55-1234-5678',
  'Mexico',
  'national_id',
  'GOGM850101HDFRRL09',
  'bank_transfer',
  { accountNumber: '012180001234567890', bankName: 'BBVA México' }
);
console.log('✅ Beneficiario 1:', recipient1.firstName, recipient1.lastName);
console.log('   País:', recipient1.country);
console.log('   Método preferido:', recipient1.preferredDeliveryMethod);

const recipient2 = createRecipient(
  'Juan',
  'Pérez',
  'juan.perez@email.com',
  '+502-5555-1234',
  'Guatemala',
  'national_id',
  'GT1234567890123',
  'cash_pickup'
);
console.log('✅ Beneficiario 2:', recipient2.firstName, recipient2.lastName);
console.log('   País:', recipient2.country);
console.log('   Método preferido:', recipient2.preferredDeliveryMethod);

console.log('\n💰 Creando remesas...');

const remittance1 = createRemittance(
  sender1.id,
  recipient1.id,
  500,
  'USD',
  'MXN',
  17.25,
  'bank_transfer'
);
console.log('\n📤 Remesa 1:');
console.log('   Enviado: $' + remittance1.amountSent, remittance1.currencySent);
console.log('   Recibe: $' + remittance1.amountReceived, remittance1.currencyReceived);
console.log('   Tasa de cambio:', remittance1.exchangeRate);
console.log('   Comisión: $' + remittance1.fee.toFixed(2));
console.log('   Costo total: $' + remittance1.totalCost.toFixed(2));
console.log('   Código de referencia:', remittance1.referenceCode);
console.log('   Estado:', remittance1.status);

const remittance2 = createRemittance(
  sender1.id,
  recipient2.id,
  200,
  'USD',
  'GTQ',
  7.80,
  'cash_pickup'
);
console.log('\n📤 Remesa 2:');
console.log('   Enviado: $' + remittance2.amountSent, remittance2.currencySent);
console.log('   Recibe: Q' + remittance2.amountReceived, remittance2.currencyReceived);
console.log('   Comisión: $' + remittance2.fee.toFixed(2));
console.log('   Código de referencia:', remittance2.referenceCode);
console.log('   Estado:', remittance2.status);

console.log('\n⚙️ Procesando remesa 1...');
let remittance1Updated = updateRemittanceStatus(remittance1, 'processing');
console.log('   Estado actualizado a:', remittance1Updated.status);

remittance1Updated = updateRemittanceStatus(remittance1Updated, 'completed');
console.log('   ✅ Remesa completada:', remittance1Updated.status);
console.log('   Fecha completado:', remittance1Updated.completedAt?.toISOString());

const allRemittances = [remittance1Updated, remittance2];

console.log('\n📊 Estadísticas del sistema:');
console.log('   Total de remesas:', listRemittances(allRemittances).length);
console.log('   Remesas pendientes:', filterByStatus(allRemittances, 'pending').length);
console.log('   Remesas completadas:', filterByStatus(allRemittances, 'completed').length);
console.log('   Remesas por transferencia bancaria:', filterByDeliveryMethod(allRemittances, 'bank_transfer').length);
console.log('   Remesas por retiro en efectivo:', filterByDeliveryMethod(allRemittances, 'cash_pickup').length);

console.log('\n🔍 Búsqueda por código de referencia:');
const foundRemittance = findByReferenceCode(allRemittances, remittance2.referenceCode);
if (foundRemittance) {
  console.log('   ✅ Encontrada remesa:', foundRemittance.referenceCode);
  console.log('   Monto:', '$' + foundRemittance.amountSent, foundRemittance.currencySent);
  console.log('   Estado:', foundRemittance.status);
}

console.log('\n💵 Control de límites:');
const totalSent = calculateTotalSentBySender(allRemittances, sender1.id);
console.log('   Total enviado por', sender1.firstName + ':', '$' + totalSent, 'USD');
console.log('   Límite mensual:', '$' + sender1.monthlyTransferLimit, 'USD');
console.log('   Disponible:', '$' + (sender1.monthlyTransferLimit - totalSent), 'USD');

console.log('\n✨ Sistema de Remesas Internacionales - Demo completada');
console.log('━'.repeat(50));
