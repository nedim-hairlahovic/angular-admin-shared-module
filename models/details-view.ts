export interface DetailsViewRow {
    label: string;
    value?: string;
    linkBuilder?: () => string;  // Function to build the public link dynamically
}
