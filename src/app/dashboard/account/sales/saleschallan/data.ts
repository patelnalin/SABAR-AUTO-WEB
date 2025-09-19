
export type Booking = {
    id: string;
    customerName: string;
    phoneNumber: string;
    email: string;
    address: string;
    idProofNumber: string; // Aadhaar / PAN
    vehicleMake: string;
    vehicleModel: string;
    vehicleColor: string;
    engineNumber: string;
    chassisNumber: string;
    exShowroomPrice: number;
    onRoadPrice: number;
    bookingDate: Date;
    bookingAmount: number;
    paymentMode: 'Cash' | 'UPI' | 'Bank Transfer' | 'Loan';
    bookingStatus: 'Pending' | 'Confirmed' | 'Cancelled';
};

export const initialBookings: Booking[] = [
    {
        id: 'book-001',
        customerName: 'Sanjay Gupta',
        phoneNumber: '9876543210',
        email: 'sanjay.g@example.com',
        address: '123, MG Road, Pune, Maharashtra',
        idProofNumber: 'ABCDE1234F',
        vehicleMake: 'Bajaj',
        vehicleModel: 'Pulsar NS200',
        vehicleColor: 'Red',
        engineNumber: 'ENG12345',
        chassisNumber: 'CHS12345',
        exShowroomPrice: 140000,
        onRoadPrice: 165000,
        bookingDate: new Date('2024-07-28'),
        bookingAmount: 5000,
        paymentMode: 'UPI',
        bookingStatus: 'Confirmed',
    },
    {
        id: 'book-002',
        customerName: 'Meera Desai',
        phoneNumber: '9123456789',
        email: 'meera.d@example.com',
        address: '45, FC Road, Pune, Maharashtra',
        idProofNumber: 'FGHIJ5678K',
        vehicleMake: 'Bajaj',
        vehicleModel: 'Dominar 400',
        vehicleColor: 'Green',
        engineNumber: 'ENG54321',
        chassisNumber: 'CHS54321',
        exShowroomPrice: 230000,
        onRoadPrice: 270000,
        bookingDate: new Date('2024-07-25'),
        bookingAmount: 10000,
        paymentMode: 'Loan',
        bookingStatus: 'Pending',
    },
    {
        id: 'book-003',
        customerName: 'Vikrant Shinde',
        phoneNumber: '8877665544',
        email: 'vikrant.s@example.com',
        address: '78, JM Road, Pune, Maharashtra',
        idProofNumber: 'LMNOP1234Q',
        vehicleMake: 'Bajaj',
        vehicleModel: 'Chetak Electric',
        vehicleColor: 'White',
        engineNumber: 'ENGE54321',
        chassisNumber: 'CHSE54321',
        exShowroomPrice: 150000,
        onRoadPrice: 160000,
        bookingDate: new Date('2024-06-15'),
        bookingAmount: 2000,
        paymentMode: 'Bank Transfer',
        bookingStatus: 'Cancelled',
    },
];
