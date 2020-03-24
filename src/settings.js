import React from "react";

export class Settings extends React.Component {
   constructor(props) {
      super(props);

      this.state = {
         size: '8',
         mineCount: '10',
      };

      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
   }

   handleChange(e) {
      this.setState({ [e.target.name]: e.target.value });
   }

   handleSubmit(e) {
      e.preventDefault();

      this.props.onSubmit(+this.state.size || 5, +this.state.mineCount || 10);
   }

   render() {
      return <form onSubmit={this.handleSubmit}>
         <label>
            Field size:
            <input name="size" type="text" value={this.state.size} onChange={this.handleChange} />
         </label>
         <label>
            Mine count:
            <input name="mineCount" type="text" value={this.state.mineCount} onChange={this.handleChange} />
         </label>
         <button type="submit">Apply</button>
      </form>
   }
}