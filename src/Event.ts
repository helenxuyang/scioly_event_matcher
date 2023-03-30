import { Student } from "Student";

export class Event {
    id: number;
    name: string;
    division: string;

    constructor(id: number, name: string, division: string) {
        this.id = id;
        this.name = name;
        this.division = division;
    }

    getPopularity(students: Student[]) {
        let rankingSum = 0;
        for (const student of students) {
            rankingSum += student.prefs[this.id];
        }
        return rankingSum;
    }

    getRatingFreqs(students: Student[], upTo=5) {
        const freqs = new Map();
        for (let i = 1; i <= upTo; i++) {
            freqs.set(i, 0);
        }
        for (const student of students) {
            const rating = student.prefs[this.id];
            if (rating <= upTo) {
                freqs.set(rating, freqs.get(rating) + 1);
            }
        }
        return freqs;
    }
}