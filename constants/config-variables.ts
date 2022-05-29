const requiredConfigVariables = {};

const optionalsConfigVariables = {};

export default {
  ...requiredConfigVariables,
  ...optionalsConfigVariables,
  checkConfigVariables() {
    const missingVariables = Object.entries(requiredConfigVariables).filter(
      ([key, value]) => !value
    );

    if (missingVariables.length > 0) {
      const missingVariablesKeys = missingVariables.map(([key]) => key);

      throw new Error(
        `The config variables "${new (Intl as any).ListFormat("en", {
          style: "long",
          type: "conjunction"
        }).format(missingVariablesKeys)}" are not defined in .env file.`
      );
    }
  }
};
