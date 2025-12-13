   import { modelConfig } from '@/config/models.config';
   import { ModelType } from '@/types/types';
   
   export const getModelGroupAndItem = (selectedModel: string) => {
  for (const [group, config] of Object.entries(modelConfig)) {
    const found = config.list.find(item => item.title === selectedModel);
    if (found) {
      return { group: group as ModelType, model: found };
    }
  }
  return null;
};