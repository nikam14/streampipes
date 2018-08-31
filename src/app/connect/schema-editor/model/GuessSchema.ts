import { RdfsClass } from '../../tsonld/RdfsClass';
import { RdfProperty } from '../../tsonld/RdfsProperty';
import { RdfId } from '../../tsonld/RdfId';
import { EventSchema } from './EventSchema';
import { DomainPropertyProbabilityList } from './DomainPropertyProbabilityList';

@RdfsClass('sp:GuessSchema')
export class GuessSchema {
  private static serialVersionUID = -3994041794693686406;

  @RdfId
  public id: string;

  @RdfProperty('sp:hasEventSchema')
  public eventSchema: EventSchema;

<<<<<<< HEAD
  @RdfProperty('sp:propertyProbabilityList')
  public eventProperties: Array<DomainPropertyProbabilityList>;
=======
    @RdfProperty('sp:hasEventSchema')
    public eventSchema: EventSchema;
>>>>>>> 22ef7584943045541de093918562793fec36adb4

  constructor() {}
}
