import { IInputs, IOutputs } from "./generated/ManifestTypes";
import './style/JSONForm.css'

export class JSONForm implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private _container: HTMLDivElement;
    private _context: ComponentFramework.Context<IInputs>;
    private _notifyOutputChanged: () => void;
    private _jsonInput: string = '';
    private _selectedProperties: string | '';
    private _backgroundColor: string | '';
    private _headingsFontSize: number | null;
    private _margins: number | null;
    private _valuesFontSize: number | null;
    private _enableShadows: boolean;

    constructor() { }

    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
        this._container = container;
        context.mode.trackContainerResize(true);
        this._context = context;
        this._notifyOutputChanged = notifyOutputChanged;

        // Set up initial data
        this._jsonInput = context.parameters.JSONInput.raw || '';
        this._enableShadows = context.parameters.Shadows.raw == "1";
        this._selectedProperties = context.parameters.SelectedProperties.raw || '';
        this._headingsFontSize = context.parameters.HeadingsFontSize.raw ? context.parameters.HeadingsFontSize.raw : 15 ;
        this._margins = context.parameters.Margins.raw ? context.parameters.Margins.raw : 30 ;
        this._valuesFontSize = context.parameters.ValuesFontSize.raw ? context.parameters.ValuesFontSize.raw : 15 ;
        this._backgroundColor = context.parameters.BackgroundColor.raw ? context.parameters.BackgroundColor.raw : 'white' ;

        // Render the control
        this.renderControl();
        this._notifyOutputChanged()
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        
        this._enableShadows = context.parameters.Shadows.raw == "1";
        this._selectedProperties = context.parameters.SelectedProperties.raw || '';
        this._backgroundColor = context.parameters.BackgroundColor.raw ? context.parameters.BackgroundColor.raw : 'white' ;
        this._headingsFontSize = context.parameters.HeadingsFontSize.raw ? context.parameters.HeadingsFontSize.raw : 15 ;
        this._valuesFontSize = context.parameters.ValuesFontSize.raw ? context.parameters.ValuesFontSize.raw : 15 ;
        this._margins = context.parameters.Margins.raw ? context.parameters.Margins.raw : 30 ;
        this._container.style.overflowY = "scroll";
        this._container.style.overflowX = "hidden";
        this._container.style.backgroundColor = this._backgroundColor;
        this._container.style.height = `${context.mode.allocatedHeight - 0}px`;
        this._container.style.width = `${context.mode.allocatedWidth - 0}px`;
        // Update data
        //this._jsonInput = context.parameters.JSONInput.raw || '';

        // Re-render the control
        this.renderControl();
    }

    public getOutputs(): IOutputs {
        // Return the updated JSON output
        return {
            JSONOutput: this._jsonInput
        };
    }

    public destroy(): void {
        // Cleanup
    }

    private renderControl(): void {
        // Clear previous content
        this._container.innerHTML = '';
    
        if (!this._jsonInput) {
            // If JSON input is empty, show a message
            const message = document.createElement('div');
            message.innerText = 'No JSON data provided.';
            this._container.appendChild(message);
            return;
        }
    
        try {
            const jsonData = JSON.parse(this._jsonInput);
            const form = document.createElement('form');
            form.className = "JSONViewForm";
            form.style.margin = this._margins+'px';
    
            let propertiesToDisplay: string[];
    
            // Check if SelectedProperties parameter is provided and not empty
            if (this._selectedProperties && this._selectedProperties.trim() !== ''&& this._selectedProperties.trim() !== 'val') {
                // Split the comma-separated string into an array of property names
                const selectedProps = this._selectedProperties.split(',').map(prop => prop.trim());
    
                // Filter the properties of jsonData based on the selected properties
                propertiesToDisplay = Object.keys(jsonData).filter(key => selectedProps.includes(key));
            } else {
                // If SelectedProperties parameter is blank, display all properties from the input JSON
                propertiesToDisplay = Object.keys(jsonData);
            }
    
            // Create form elements dynamically based on the selected properties
            propertiesToDisplay.forEach(key => {
                const value = jsonData[key];
    
                const label = document.createElement('label');
                label.style.fontSize = this._headingsFontSize + 'px';
                label.innerText = this.toTitleCase(key);
                label.className = "JSONViewLabel";
        
                const input = document.createElement('input');
                input.style.boxShadow = this._enableShadows? 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px':'';
                input.className = "JSONViewInput";
                input.style.backgroundColor = 'white';
                input.style.fontSize = this._valuesFontSize + 'px';
                input.id = key;
                let datatype = typeof value === 'boolean' ? 'checkbox' : typeof value === 'number' ? 'number' : 'text';
                datatype = datatype === 'text' && this.isDateString(String(value)) ? 'date' : datatype; 
                input.type = datatype;
                let inputValue = datatype === 'date' ? `${new Date(value).getFullYear()}-${(new Date(value).getMonth() + 1).toString().padStart(2, '0')}-${new Date(value).getDate().toString().padStart(2, '0')}` : String(value); 
                input.value = String(inputValue);
    
                // Add event listener to input elements to update JSON data
                input.addEventListener('change', () => {
                    this.updateJsonData(key, typeof value === 'boolean' ? input.checked : input.value, datatype);
                });
    
                form.appendChild(label);
                form.appendChild(input);
                form.appendChild(document.createElement('br'));
            });
    
            this._container.appendChild(form);
        } catch (error) {
            // If JSON parsing fails, show an error message
            const errorMessage = document.createElement('div');
            errorMessage.innerText = 'Invalid JSON format.';
            this._container.appendChild(errorMessage);
            console.log(error)
        }
    }
    
    private isDateString(sDate:string) {
        const newDate = new Date(sDate);
        return !isNaN(newDate.getTime());
      }

    private  toTitleCase(str:string) {
        return str.replace(
          /\w\S*/g,
          function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
          }
        );
      }
      private updateJsonData(key: string, value: string | boolean | number, dataype:string): void {
        try {
            console.log('changed')
            console.log(dataype)
            if (dataype === 'number' && parseFloat(value as string)) {
                value = parseFloat(value as string);
            }
            const jsonData = JSON.parse(this._jsonInput);
            let updatedValue: any = value; // Initialize the updated value    
            jsonData[key] = updatedValue; // Update the value in the JSON object
            const updatedJsonInput = JSON.stringify(jsonData);
    
            // Notify the framework that output has changed only if the JSON input has actually changed
            if (updatedJsonInput !== this._jsonInput) {
                this._jsonInput = updatedJsonInput;
                this._notifyOutputChanged();
            }
        } catch (error) {
            console.error('Error updating JSON data:', error);
        }
    }
    
    
}
