type AddOrEditAstromanEvent = {
    itemId: number;
    data: {
        firstName: string;
        lastName: string;
        dob: string;
        skills: number[];
    };
};

export type { AddOrEditAstromanEvent };
