package difference_operators;

import java.util.List;

import common.DifferenceQuery;
import common.ExperimentalSettings;
import common.InputQuery;
import common.InputTablesMetadata;

public interface DifferenceOperator {
	// TODO: this may not need experimental settings at all
	public List<DifferenceQuery> getDifferenceQueries(InputQuery[] inputQueries, 
			InputTablesMetadata[] queryMetadatas, int numDatasets, ExperimentalSettings settings);

}
